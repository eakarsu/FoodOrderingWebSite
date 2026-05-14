// Stripe + delivery-provider (DoorDash Drive / Uber Direct) integration.
// TODO: configure credentials — STRIPE_SECRET_KEY, DOORDASH_DEVELOPER_ID, DOORDASH_KEY_ID, DOORDASH_SIGNING_SECRET, UBER_DIRECT_CLIENT_ID, UBER_DIRECT_CLIENT_SECRET.
import express, { type Request, type Response } from "express";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

let stripe: any = null;
try {
  const Stripe = require("stripe");
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-04-10" });
  }
} catch {
  /* stripe package not installed */
}

// POST /api/stripe-delivery/payment-intent
router.post("/payment-intent", requireAuth, async (req: Request, res: Response) => {
  try {
    if (!stripe) return res.status(503).json({ error: "Stripe not configured" });
    const { amount, currency = "usd", orderId, customerEmail } = req.body;
    if (!amount) return res.status(400).json({ error: "amount required" });
    const intent = await stripe.paymentIntents.create({
      amount,
      currency,
      receipt_email: customerEmail,
      metadata: { orderId: orderId || "" }
    });
    res.json({ clientSecret: intent.client_secret, id: intent.id });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/stripe-delivery/dispatch — request a courier from a provider.
router.post("/dispatch", requireAuth, async (req: Request, res: Response) => {
  try {
    const { provider = "doordash", orderId, pickupAddress, dropoffAddress, tip } = req.body;
    if (!orderId || !pickupAddress || !dropoffAddress) {
      return res.status(400).json({ error: "orderId, pickupAddress, dropoffAddress required" });
    }

    if (provider === "doordash") {
      const { DOORDASH_DEVELOPER_ID, DOORDASH_KEY_ID } = process.env;
      if (!DOORDASH_DEVELOPER_ID || !DOORDASH_KEY_ID) {
        return res.status(503).json({ error: "DoorDash not configured" });
      }
      // TODO: configure credentials — implement JWT-signed POST to /drive/v2/deliveries.
      return res.json({ provider, status: "queued", trackingUrl: null, note: "Implement DoorDash signing" });
    }

    if (provider === "uber-direct") {
      const { UBER_DIRECT_CLIENT_ID, UBER_DIRECT_CLIENT_SECRET } = process.env;
      if (!UBER_DIRECT_CLIENT_ID || !UBER_DIRECT_CLIENT_SECRET) {
        return res.status(503).json({ error: "Uber Direct not configured" });
      }
      // TODO: configure credentials — exchange client creds for OAuth, then POST /v1/customers/{id}/deliveries.
      return res.json({ provider, status: "queued", trackingUrl: null, note: "Implement Uber Direct flow" });
    }

    res.status(400).json({ error: `Unknown provider ${provider}` });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
