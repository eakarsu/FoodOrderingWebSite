import express, { type Request, Response, NextFunction } from "express";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from "http";
import jwt from "jsonwebtoken";
import pg from "pg";
import crypto from "crypto";
import { promisify } from "util";
// @ts-ignore CommonJS governance kernel is bundled by esbuild.
import governanceRouter from "../governance/index.cjs";

const { Pool } = pg;
const scrypt = promisify(crypto.scrypt);
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt$${salt}$${derived.toString("hex")}`;
}

async function passwordMatches(password: string, encoded: string): Promise<boolean> {
  const [scheme, salt, expectedHex] = encoded.split("$");
  if (scheme !== "scrypt" || !salt || !expectedHex) return false;
  const expected = Buffer.from(expectedHex, "hex");
  const actual = (await scrypt(password, salt, expected.length)) as Buffer;
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

const signedAccess = (req: Request, res: Response, next: NextFunction) => {
  const secret = process.env.JWT_SECRET || "";
  const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
  if (secret.length < 32) return res.status(503).json({ message: "secure JWT configuration required" });
  try {
    const claims = jwt.verify(token || "", secret, { algorithms: ["HS256"] }) as any;
    if (!claims.tenantId || !claims.role || !Array.isArray(claims.subjectIds)) throw new Error("claims");
    (req as any).user = claims;
    next();
  } catch (_) { res.status(401).json({ message: "signed tenant, role, and subject scope required" }); }
};

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/governance", governanceRouter);

app.post("/api/auth/register", async (req, res) => {
  const { email, password, name, firstName, first_name } = req.body || {};
  if (typeof email !== "string" || typeof password !== "string" || password.length < 8) {
    return res.status(400).json({ message: "A valid email and password of at least 8 characters are required" });
  }
  const tenantId = process.env.GOVERNANCE_TENANT_ID || "";
  if (!tenantId) return res.status(503).json({ message: "tenant configuration required" });
  try {
    const result = await pool.query(
      `INSERT INTO app_users (tenant_id, email, password_hash, name)
       VALUES ($1, lower($2), $3, $4)
       ON CONFLICT (tenant_id, email) DO NOTHING
       RETURNING id, email, name, role`,
      [tenantId, email, await hashPassword(password), name || firstName || first_name || "Customer"],
    );
    if (result.rows.length === 0) return res.status(409).json({ message: "Email already registered" });
    return res.status(201).json({ user: result.rows[0] });
  } catch {
    return res.status(500).json({ message: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const tenantId = process.env.GOVERNANCE_TENANT_ID || "";
  const result = await pool.query(
    "SELECT id, email, password_hash, name, role FROM app_users WHERE tenant_id = $1 AND email = lower($2)",
    [tenantId, email],
  );
  const user = result.rows[0];
  if (!user || !(await passwordMatches(password, user.password_hash))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const subjectIds = [`customer:${user.id}`];
  const token = jwt.sign(
    { sub: String(user.id), userId: user.id, tenantId, role: user.role, subjectIds },
    process.env.JWT_SECRET || "",
    { algorithm: "HS256", expiresIn: "24h" },
  );
  return res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

app.get("/api/auth/me", signedAccess, async (req, res) => {
  const actor = (req as any).user;
  const result = await pool.query(
    "SELECT id, email, name, role FROM app_users WHERE tenant_id = $1 AND id = $2",
    [actor.tenantId, actor.userId || actor.sub],
  );
  if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });
  return res.json({ user: result.rows[0] });
});

const requiredOpenRouterBase = "https://openrouter.ai/api/v1";
app.post("/api/ai/order-advice", signedAccess, async (req, res, next) => {
  const prompt = typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";
  if (prompt.length < 10 || prompt.length > 5000) return res.status(400).json({ message: "prompt length is invalid" });
  try {
    if (!process.env.OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY is required");
    if (!process.env.OPENROUTER_MODEL) throw new Error("OPENROUTER_MODEL is required");
    if (process.env.OPENROUTER_BASE_URL !== requiredOpenRouterBase) throw new Error("OPENROUTER_BASE_URL must use the configured OpenRouter API");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), Number(process.env.OPENROUTER_TIMEOUT_MS || 120000));
    let providerResponse: globalThis.Response;
    try {
      providerResponse = await fetch(`${requiredOpenRouterBase}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.CLIENT_URL || `http://127.0.0.1:${process.env.FRONTEND_PORT}`,
          "X-Title": "Food Ordering Web Site",
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL,
          messages: [
            { role: "system", content: "You are a food-ordering operations advisor. Give concise, practical guidance while flagging allergy, availability, payment, fulfillment, and human-confirmation constraints. Never claim an order or payment was executed." },
            { role: "user", content: prompt },
          ],
          temperature: 0.2,
          max_tokens: 700,
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }
    const payload: any = await providerResponse.json().catch(() => null);
    if (!providerResponse.ok) throw new Error(`OpenRouter request failed with status ${providerResponse.status}`);
    const advice = payload?.choices?.[0]?.message?.content?.trim();
    if (!advice) throw new Error("OpenRouter returned no ordering advice");
    const actor = (req as any).user;
    const stored = await pool.query(
      `INSERT INTO food_order_ai_results(tenant_id,user_id,prompt,model,provider_receipt_id,result,usage)
       VALUES($1,$2,$3,$4,$5,$6,$7::jsonb) RETURNING id,created_at`,
      [actor.tenantId, actor.userId || actor.sub, prompt, process.env.OPENROUTER_MODEL, payload.id || null, advice, JSON.stringify(payload.usage || {})],
    );
    return res.json({ id: stored.rows[0].id, advice, model: process.env.OPENROUTER_MODEL, createdAt: stored.rows[0].created_at });
  } catch (error) {
    return next(error);
  }
});

app.use("/api", signedAccess);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await pool.query("SELECT 1");
  const server = process.env.ENABLE_GENERATED_FEATURES === "true" && process.env.NODE_ENV !== "production"
    ? await (await import("./routes")).registerRoutes(app)
    : createServer(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    log(`request failed with status ${status}`);
    res.status(status).json({ message: app.get("env") === "development" ? err.message : "Internal Server Error" });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") !== "production") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use PORT environment variable or default to 5000
  // this serves both the API and the client.
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: process.env.BACKEND_HOST || process.env.HOST || "127.0.0.1",
  }, () => {
    log(`serving on port ${port}`);
  });
})();
