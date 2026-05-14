// Real-time kitchen display + customer order tracker (WebSocket).
import express, { type Request, type Response } from "express";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import { requireAuth, requireRole } from "../middleware/auth";

const router = express.Router();

let io: IOServer | null = null;

export function attachSockets(server: HttpServer) {
  io = new IOServer(server, { cors: { origin: "*" } });
  io.on("connection", (socket) => {
    socket.on("kitchen:join", (room: string) => socket.join(`kitchen:${room}`));
    socket.on("customer:join", (orderId: string) => socket.join(`order:${orderId}`));
  });
  return io;
}

// POST /api/kitchen-display/order-state — push a state change to KDS + customer.
router.post("/order-state", requireAuth, async (req: Request, res: Response) => {
  try {
    const { orderId, status, etaMinutes, location } = req.body;
    if (!orderId || !status) return res.status(400).json({ error: "orderId and status required" });
    const payload = { orderId, status, etaMinutes, location, at: new Date() };
    if (io) {
      io.to(`kitchen:${location || "default"}`).emit("kds:update", payload);
      io.to(`order:${orderId}`).emit("order:update", payload);
    }
    res.json({ ok: true, broadcast: !!io, payload });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/kitchen-display/health — confirm sockets are up.
router.get("/health", (_req, res) => {
  res.json({ socketsAttached: !!io, time: new Date().toISOString() });
});

// POST /api/kitchen-display/announce — broadcast a kitchen-wide alert.
router.post("/announce", requireAuth, requireRole(["admin", "manager"]), (req: Request, res: Response) => {
  const { message, location = "default" } = req.body;
  if (!message) return res.status(400).json({ error: "message required" });
  io?.to(`kitchen:${location}`).emit("kds:announce", { message, at: new Date() });
  res.json({ ok: true });
});

export default router;
