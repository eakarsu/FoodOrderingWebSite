// Vision-based menu photo intake to auto-create items.
import express, { type Request, type Response } from "express";
import OpenAI from "openai";
import { requireAuth, requireRole } from "../middleware/auth";
import { storage } from "../storage";

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || "",
  baseURL: process.env.OPENROUTER_API_KEY ? "https://openrouter.ai/api/v1" : undefined
});

const VISION_MODEL = process.env.OPENROUTER_VISION_MODEL || "anthropic/claude-3-5-sonnet-20241022";

// POST /api/vision-menu/extract — read a menu photo URL and return structured items.
router.post("/extract", requireAuth, requireRole(["admin", "manager"]), async (req: Request, res: Response) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) return res.status(400).json({ error: "imageUrl required" });
    if (!process.env.OPENROUTER_API_KEY && !process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: "AI not configured" });
    }

    const response = await openai.chat.completions.create({
      model: VISION_MODEL,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: 'Extract menu items as JSON array: [{"name":string,"description":string,"price":number,"category":string}]. Return ONLY the JSON array.'
            },
            { type: "image_url", image_url: { url: imageUrl } }
          ] as any
        }
      ],
      max_tokens: 2000
    });

    const raw = response.choices[0]?.message?.content || "[]";
    const match = raw.match(/\[[\s\S]*\]/);
    let items: any[] = [];
    try { items = JSON.parse(match ? match[0] : raw); } catch { items = []; }
    res.json({ extracted: items.length, items });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/vision-menu/import — actually create menu rows from previously extracted items.
router.post("/import", requireAuth, requireRole(["admin", "manager"]), async (req: Request, res: Response) => {
  try {
    const { items, dryRun = false } = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ error: "items[] required" });

    const created: any[] = [];
    for (const it of items) {
      if (dryRun) { created.push(it); continue; }
      try {
        // Storage interface varies; fall back to logging if no createMenuItem exists.
        const fn = (storage as any).createMenuItem || (storage as any).insertMenuItem;
        if (typeof fn === "function") {
          const row = await fn.call(storage, it);
          created.push(row);
        } else {
          created.push({ ...it, _note: "no createMenuItem in storage; not persisted" });
        }
      } catch (err: any) {
        created.push({ ...it, _error: err.message });
      }
    }
    res.json({ created: created.length, items: created, dryRun });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
