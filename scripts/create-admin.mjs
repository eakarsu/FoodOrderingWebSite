import crypto from "node:crypto";
import { promisify } from "node:util";
import pg from "pg";

const scrypt = promisify(crypto.scrypt);
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = await scrypt(password, salt, 64);
  return `scrypt$${salt}$${derived.toString("hex")}`;
}

async function main() {
  if (process.env.BOOTSTRAP_ACKNOWLEDGEMENT !== "create-initial-admin") {
    throw new Error("Explicit bootstrap acknowledgement is required");
  }
  const email = (process.env.PROVISION_ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.PROVISION_ADMIN_PASSWORD || "";
  const name = (process.env.PROVISION_ADMIN_NAME || "").trim();
  const tenantId = (process.env.GOVERNANCE_TENANT_ID || process.env.TENANT_ID || "").trim();
  if (!email || !name || !tenantId || password.length < 12) {
    throw new Error("Admin email, name, tenant, and a 12+ character password are required");
  }

  await pool.query(
    `INSERT INTO app_users (tenant_id, email, password_hash, name, role)
     VALUES ($1, $2, $3, $4, 'admin')
     ON CONFLICT (tenant_id, email) DO UPDATE SET
       password_hash = EXCLUDED.password_hash,
       name = EXCLUDED.name,
       role = EXCLUDED.role,
       updated_at = NOW()`,
    [tenantId, email, await hashPassword(password), name]
  );
  console.log("Administrator provisioned.");
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
