// Loyalty program with AI-driven offer targeting.
import express, { type Request, type Response } from "express";
import OpenAI from "openai";
import { requireAuth } from "../middleware/auth";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY || "" });

// In-memory loyalty store; replace with Drizzle model when ready.
type Profile = { customerId: string; points: number; tier: string; history: any[] };
const profiles: Map<string, Profile> = new Map();

function tier(points: number): string {
  if (points > 500) return "platinum";
  if (points > 250) return "gold";
  if (points > 100) return "silver";
  return "bronze";
}

router.post("/earn", requireAuth, (req: Request, res: Response) => {
  const { customerId, amount, orderId } = req.body;
  if (!customerId || amount == null) return res.status(400).json({ error: "customerId and amount required" });
  const p = profiles.get(customerId) || { customerId, points: 0, tier: "bronze", history: [] };
  const earned = Math.floor(amount);
  p.points += earned;
  p.tier = tier(p.points);
  p.history.push({ orderId, earned, at: new Date() });
  profiles.set(customerId, p);
  res.json({ profile: p, earned });
});

router.post("/personalized-offer", requireAuth, async (req: Request, res: Response) => {
  try {
    const { customerId, recentItems = [] } = req.body;
    const p = profiles.get(customerId) || { customerId, points: 0, tier: "bronze", history: [] };

    if (!process.env.OPENAI_API_KEY && !process.env.OPENROUTER_API_KEY) {
      return res.json({ profile: p, offer: { headline: "Earn double points today!", code: "LOYAL2X", discountPct: 0 } });
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "You craft 1 personalized offer as JSON {headline, body, code, discountPct}." },
        { role: "user", content: `Tier=${p.tier} points=${p.points}. Recent items: ${JSON.stringify(recentItems).slice(0, 800)}` }
      ],
      max_tokens: 300
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const match = raw.match(/\{[\s\S]*\}/);
    let offer;
    try { offer = JSON.parse(match ? match[0] : raw); } catch { offer = { headline: raw.slice(0, 80) }; }
    res.json({ profile: p, offer });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:customerId", requireAuth, (req: Request, res: Response) => {
  res.json(profiles.get(req.params.customerId) || { customerId: req.params.customerId, points: 0, tier: "bronze", history: [] });
});

export default router;
