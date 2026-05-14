import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import { registerRoutes } from "./routes";
import { setupAuth } from "./auth";
import { generalLimiter } from "./middleware/rateLimit";
import { sanitizeInput } from "./middleware/validation";
import { ZodError } from "zod";

// Simple log function for production compatibility
function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

const app = express();

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Disabled for dev; enable in production
    crossOriginEmbedderPolicy: false,
  })
);

// Rate limiting
app.use(generalLimiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Input sanitization
app.use(sanitizeInput);

// Auth setup (passport + session)
setupAuth(app);

// Request logging
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
        logLine = logLine.slice(0, 79) + "\u2026";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app); app.use('/api/kitchen-display', (await import('./routes/kitchenDisplay.js')).default); (await import('./routes/kitchenDisplay.js')).attachSockets(server); app.use('/api/stripe-delivery', (await import('./routes/stripeDelivery.js')).default); app.use('/api/loyalty', (await import('./routes/loyaltyOffers.js')).default); app.use('/api/vision-menu', (await import('./routes/visionMenuIntake.js')).default); app.use('/api/tenancy', (await import('./routes/tenancy.js')).default);

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    // Zod validation errors
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }

    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    if (status === 500) {
      console.error("Server error:", err);
    }

    res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "development") {
    try {
      const { setupVite } = await import("./vite.js");
      await setupVite(app, server);
    } catch (error) {
      log("Vite setup failed, falling back to static serving", "server");
      const path = await import("path");
      app.use(express.static(path.resolve("dist/public")));
      app.get("*", (_req, res) => {
        res.sendFile(path.resolve("dist/public/index.html"));
      });
    }
  } else {
    // Serve static files in production
    const path = await import("path");
    app.use(express.static(path.resolve("dist/public")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve("dist/public/index.html"));
    });
  }

  // Use PORT environment variable or default to 5000
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    }
  );
})();
// Export the app for Vercel
export default app;
