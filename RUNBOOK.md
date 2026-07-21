# Food ordering operations

The governed API is authoritative for checkout evidence and lifecycle decisions. The prior in-memory menu/order prototype is disabled by default and forbidden in production. Identity JWTs must carry signed actor, tenant, role, and subject scopes. Restaurant and location ownership are explicit on every order.

Run `./start.sh check`, back up PostgreSQL, then run `ALLOW_SCHEMA_MIGRATION=1 ./start.sh migrate`. Migrations are additive and repeatable. Start with `./start.sh start`; startup performs a read-only database readiness query and never installs, seeds, or kills unrelated processes. Rollback begins by deploying prior application code while retaining additive tables; restore the backup only after reconciling accepted orders.

Payment, inventory, tax, kitchen display/printer, delivery, notification, and webhook operations use provider-typed outbox records and idempotency keys. Workers claim with bounded leases, store non-secret receipts, retry transient failures, and send the fifth failed attempt to the dead-letter queue. Reconcile payment authorization/capture/refund and kitchen/driver state before replay.

Customer, restaurant operator, kitchen, payment worker, and administrator scopes are distinct. Preserve immutable events for price, promotion, tax/tip, cancellation, partial/full refund, kitchen, pickup, and delivery decisions. Apply retention and legal holds; downstream deletion must be receipt backed. On duplicate charge, stock divergence, tenant leak, or kitchen outage, stop affected workers, preserve evidence, notify the location owner, and recover from the last provider receipt/checkpoint.
