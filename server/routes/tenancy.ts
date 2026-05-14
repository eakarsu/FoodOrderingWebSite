// Multi-tenant white-label support for additional restaurants.
import express, { type Request, type Response } from "express";
import { requireAuth, requireRole } from "../middleware/auth";

const router = express.Router();

// In-memory tenant registry; replace with `tenants` table.
type Tenant = {
  id: string;
  slug: string;
  name: string;
  primaryColor?: string;
  logoUrl?: string;
  domain?: string;
  createdAt: Date;
};
const tenants: Map<string, Tenant> = new Map();

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);
}

// Middleware exposed for the app to attach: `req.tenant` from x-tenant-slug header.
export function tenantContext(req: Request, _res: any, next: any) {
  const slug = (req.headers["x-tenant-slug"] as string) || "default";
  const found = [...tenants.values()].find(t => t.slug === slug);
  (req as any).tenant = found || null;
  next();
}

// POST /api/tenancy — create a tenant.
router.post("/", requireAuth, requireRole(["admin"]), (req: Request, res: Response) => {
  try {
    const { name, primaryColor, logoUrl, domain } = req.body;
    if (!name) return res.status(400).json({ error: "name required" });
    const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const slug = slugify(name);
    if ([...tenants.values()].some(t => t.slug === slug)) {
      return res.status(409).json({ error: "Tenant slug already exists" });
    }
    const tenant: Tenant = { id, slug, name, primaryColor, logoUrl, domain, createdAt: new Date() };
    tenants.set(id, tenant);
    res.status(201).json(tenant);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/", requireAuth, (_req: Request, res: Response) => {
  res.json([...tenants.values()]);
});

router.get("/:slug", requireAuth, (req: Request, res: Response) => {
  const t = [...tenants.values()].find(t => t.slug === req.params.slug);
  if (!t) return res.status(404).json({ error: "Tenant not found" });
  res.json(t);
});

router.patch("/:id", requireAuth, requireRole(["admin"]), (req: Request, res: Response) => {
  const t = tenants.get(req.params.id);
  if (!t) return res.status(404).json({ error: "Tenant not found" });
  const { name, primaryColor, logoUrl, domain } = req.body;
  if (name) { t.name = name; t.slug = slugify(name); }
  if (primaryColor) t.primaryColor = primaryColor;
  if (logoUrl) t.logoUrl = logoUrl;
  if (domain) t.domain = domain;
  res.json(t);
});

export default router;
