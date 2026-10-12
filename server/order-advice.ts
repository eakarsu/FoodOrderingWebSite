import { Router, type Request, type RequestHandler } from 'express';
import type { Pool } from 'pg';
import { AdvisoryError, execution, providerResult } from './advisory-execution';

export function createOrderAdviceRouter({ db, signedAccess, providerFetch = fetch }: { db: Pool; signedAccess: RequestHandler; providerFetch?: typeof fetch }) {
  const router = Router();
  router.use(signedAccess);
  async function actor(request: Request, store = db) {
    const claims = (request as Request & { user?: { tenantId: string; userId?: string; sub?: string; role: string } }).user;
    if (!claims?.tenantId || !claims.role) throw new AdvisoryError('Authentication required', 401);
    const userId = claims.userId || claims.sub;
    if (typeof userId !== 'string' || !/^[0-9a-f-]{36}$/i.test(userId)) throw new AdvisoryError('Authentication required', 401);
    const row = (await store.query('SELECT id,role FROM app_users WHERE tenant_id=$1 AND id=$2', [claims.tenantId, userId])).rows[0];
    if (!row || row.role !== claims.role) throw new AdvisoryError('Your session changed. Sign in again.', 401);
    return { userId, tenantId: claims.tenantId };
  }
  router.get('/', async (req, res) => {
    try {
      const user = await actor(req);
      const reports = (await db.query('SELECT id,prompt,result AS content,model,created_at AS "createdAt" FROM food_order_ai_results WHERE tenant_id=$1 AND user_id=$2 ORDER BY created_at DESC LIMIT 50', [user.tenantId, user.userId])).rows;
      res.json({ reports });
    } catch (error) { res.status(error instanceof AdvisoryError ? error.status : 500).json({ error: error instanceof AdvisoryError ? error.message : 'Saved reports could not be loaded' }); }
  });
  router.post('/', async (req, res) => {
    const disconnect = new AbortController();
    const closed = () => { if (!res.writableEnded) disconnect.abort(); };
    res.once('close', closed); req.once('aborted', closed); if (req.aborted) closed();
    const timeout = Number(process.env.OPENROUTER_TIMEOUT_MS || 60_000);
    const job = execution(disconnect.signal, Number.isFinite(timeout) ? Math.max(100, Math.min(120_000, timeout)) : 60_000);
    try {
      const user = await actor(req); job.check();
      const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
      if (prompt.length < 10 || prompt.length > 5000) throw new AdvisoryError('Prompt must contain 10–5000 characters.', 400);
      const apiKey = process.env.OPENROUTER_API_KEY, model = process.env.OPENROUTER_MODEL;
      if (!apiKey || !model || process.env.OPENROUTER_BASE_URL?.replace(/\/$/, '') !== 'https://openrouter.ai/api/v1') throw new AdvisoryError('OpenRouter is not configured', 503);
      const response = await providerFetch('https://openrouter.ai/api/v1/chat/completions', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'X-Title': 'Food Ordering Web Site' }, body: JSON.stringify({ model, messages: [{ role: 'system', content: 'You are a food-ordering operations advisor. Give concise, practical guidance while flagging allergy, availability, payment, fulfillment, and human-confirmation constraints. Never claim an order or payment was executed.' }, { role: 'user', content: prompt }], temperature: 0.2, max_tokens: 700 }), signal: job.signal });
      const payload = await response.json().catch(() => null);
      const { content, receipt } = providerResult(payload, response, model); job.check();
      const client = await db.connect(); let row;
      try {
        await client.query('BEGIN');
        const fresh = (await client.query('SELECT id,role FROM app_users WHERE tenant_id=$1 AND id=$2', [user.tenantId, user.userId])).rows[0];
        if (!fresh || fresh.role !== (req as Request & { user: { role: string } }).user.role) throw new AdvisoryError('Your session changed. Sign in again.', 401);
        job.check();
        row = (await client.query('INSERT INTO food_order_ai_results(tenant_id,user_id,prompt,model,provider_receipt_id,result,usage) VALUES($1,$2,$3,$4,$5,$6,$7::jsonb) RETURNING id,created_at', [user.tenantId, user.userId, prompt, receipt.upstreamModel, receipt.id, content, JSON.stringify(payload?.usage || {})])).rows[0];
        job.check(); await client.query('COMMIT');
      } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
      if (!res.destroyed) res.json({ id: row.id, advice: content, model: receipt.upstreamModel, createdAt: row.created_at });
    } catch (error) {
      const failure = job.signal.aborted ? job.signal.reason : error;
      if (!res.destroyed) res.status(failure instanceof AdvisoryError ? failure.status : 502).json({ error: failure instanceof AdvisoryError ? failure.message : 'AI provider request failed' });
    } finally { job.close(); res.removeListener('close', closed); req.removeListener('aborted', closed); }
  });
  return router;
}
