BEGIN;
CREATE TABLE IF NOT EXISTS food_order_lifecycle (
  tenant_id TEXT NOT NULL, id UUID NOT NULL DEFAULT gen_random_uuid(), subject_id TEXT NOT NULL,
  customer_actor_id TEXT NOT NULL, restaurant_id TEXT NOT NULL, location_id TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'draft' CHECK(state IN('draft','payment_authorization_pending','payment_authorized','payment_failed','confirmed','preparing','ready','picked_up','out_for_delivery','delivery_failed','delivered','cancelled','refund_pending','refunded','refund_failed')),
  totals JSONB NOT NULL, fulfillment JSONB NOT NULL, payment_capture_state TEXT NOT NULL DEFAULT 'uncaptured',
  idempotency_key TEXT NOT NULL, request_hash CHAR(64) NOT NULL, version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(tenant_id,id), UNIQUE(tenant_id,idempotency_key)
);
CREATE TABLE IF NOT EXISTS food_order_events (
  id BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, order_id UUID NOT NULL, actor_id TEXT NOT NULL,
  event_type TEXT NOT NULL, details JSONB NOT NULL DEFAULT '{}', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY(tenant_id,order_id) REFERENCES food_order_lifecycle(tenant_id,id)
);
CREATE TABLE IF NOT EXISTS food_order_provider_outbox (
  id BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, order_id UUID NOT NULL, provider TEXT NOT NULL,
  operation TEXT NOT NULL, payload JSONB NOT NULL, idempotency_key TEXT NOT NULL, request_hash CHAR(64) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN('pending','processing','failed','delivered','dead_letter')),
  attempts INTEGER NOT NULL DEFAULT 0, next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), lease_token UUID,
  lease_expires_at TIMESTAMPTZ, provider_receipt JSONB, delivered_at TIMESTAMPTZ,
  FOREIGN KEY(tenant_id,order_id) REFERENCES food_order_lifecycle(tenant_id,id), UNIQUE(tenant_id,provider,idempotency_key)
);
CREATE OR REPLACE FUNCTION food_order_events_append_only() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'food order events are append-only'; END $$;
DROP TRIGGER IF EXISTS food_order_events_append_only ON food_order_events;
CREATE TRIGGER food_order_events_append_only BEFORE UPDATE OR DELETE ON food_order_events FOR EACH ROW EXECUTE FUNCTION food_order_events_append_only();
COMMIT;
