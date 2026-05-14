# Audit Apply Notes — FoodOrderingWebSite

Source: `_AUDIT/reports/batch_10.md` § Skeletons #3 FoodOrderingWebSite

## Original audit recommendations

> Web-based food ordering system. Node.js. **Backend**: No. **Routes**: 0. **AI**: 0 endpoints.
> **Notes**: `has_node_modules`, `has_git`. Boilerplate Node app, no endpoints.
> **What's missing**: Order management, restaurant catalog, payments, tracking. No AI for personalization or demand prediction.
> **Verdict**: SKELETON.

## Implemented this pass

**None.** Skeleton — no scaffolding to extend mechanically without first making product decisions about stack and domain model. The audit does not list specific AI endpoints to add, and the codebase has no routes/controllers to mirror.

## Categorisation

- All NEEDS-PRODUCT-DECISION / NEEDS-SCHEMA: stack choice (Express vs Next.js vs Fastify), data model (orders, restaurants, payments), and tracking strategy must be defined before any safe code addition.

## Apply pass 3 (frontend)

LEFT-AS-IS — frontend already substantively wired. Audit originally flagged this as a "skeleton" but the project is in fact a full Vite/React + Express + Drizzle stack with substantial AI surfaces. `src/pages/AIFeaturesPage.tsx` (797 lines, mounted at `/ai-features` in `src/App.tsx`) wires `POST /api/ai/scheduling/predict`, `POST /api/ai/email/analyze`, `POST /api/ai/document/analyze`, `POST /api/ai/call/analyze`, plus `POST /api/communication/translate`. Auth is session/passport based (no JWT-in-localStorage applies). Three secondary helper endpoints (`/api/ai/scheduling/analyze-preferences`, `/api/ai/email/categorize`, `/api/ai/sector/analyze`) are defined server-side but not surfaced in the FE — they are sub-helpers without natural standalone UIs and were left as backend-only utility endpoints (NEEDS-PRODUCT-DECISION about whether to expose them as separate demo tiles vs fold them into the existing flows).

## Apply pass 4 (mechanical backlog)

Surfaced the three previously-unexposed backend helper endpoints as new demo tiles in `src/pages/AIFeaturesPage.tsx`:

- `preferences` tab — calls `POST /api/ai/scheduling/analyze-preferences` (user id + JSON array of past appointments).
- `email-batch` tab — calls `POST /api/ai/email/categorize` (JSON array of emails, with a fallback that splits blank-line-separated bodies).
- `sector` tab — calls `POST /api/ai/sector/analyze` (sector id + free-form data, JSON or text).

Each new tab follows the existing `AIFeaturesPage` pattern: shadcn `Card` / `Button` / `Input` / `Textarea` from `../components/ui/*`, `useToast`, in-page result rendering, and explicit `503` handling that surfaces an "AI service not configured" toast. Auth follows the project's existing session/passport convention (cookies on same-origin `fetch`); no JWT bearer applies. No new deps; `@babel/parser` (jsx + typescript plugins) parses the file cleanly.

Backlog still deferred: the audit's underlying skeleton concerns (full ordering-domain stack: orders, restaurants, payments, tracking) remain NEEDS-PRODUCT-DECISION — the in-place project is a different sector-toolkit product and adding a food-ordering domain would conflict with the actual app.
