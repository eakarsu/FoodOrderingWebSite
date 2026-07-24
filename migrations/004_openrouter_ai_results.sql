BEGIN;
CREATE TABLE IF NOT EXISTS food_order_ai_results(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES app_users(id),
  prompt TEXT NOT NULL,
  model TEXT NOT NULL,
  provider_receipt_id TEXT,
  result TEXT NOT NULL,
  usage JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS food_order_ai_results_tenant_user_created_idx
  ON food_order_ai_results(tenant_id, user_id, created_at DESC);
COMMIT;
