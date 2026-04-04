# Generative AI Extension Guide

This project already includes portfolio chat. This guide defines how to extend AI capabilities safely.

## Current baseline

- API route: `src/app/(chat)/api/chat/route.ts`
- Prompt/provider config: `src/lib/ai.ts`
- Client chat UI: `src/features/chat/*`
- KV keepalive cron route: `src/app/api/cron/kv-keepalive/route.ts`
- Existing runtime controls:
  - message length cap
  - limited context history
  - per-IP rate limiting

## Extension principles

- Keep deterministic guardrails outside the model prompt when possible.
- Keep model instructions concise and task-specific.
- Prefer explicit output contracts (JSON schema/tool calls) for non-trivial actions.
- Introduce features incrementally behind clear boundaries.

## Suggested architecture for advanced AI features

1. Keep chat assistant stable:
  - preserve existing `/api/chat` behavior.
2. Add new features as separate routes/modules:
  - e.g. `/api/ai/summarize`, `/api/ai/rewrite`, `/api/ai/portfolio-qa`
3. Create per-feature prompt files:
  - e.g. `src/lib/ai/prompts/<feature>.ts`
4. Add per-feature limits:
  - input length
  - request/day quota
  - timeout and retry policy

## Safety and reliability checklist

- Validate input shape with `zod`.
- Enforce output shape before UI render or side effects.
- Handle model/network errors with user-safe fallback text.
- Log enough to debug failures without leaking secrets.
- Avoid exposing sensitive env vars in client bundles.

## Model and provider strategy

- Keep provider/model IDs centralized in one config location.
- Use explicit default model per feature.
- For multi-model support, add selection policy docs:
  - feature -> preferred model
  - fallback model
  - reason (latency, cost, quality)

### Current chat agent policy (free-tier oriented)

- Source of truth:
  - `src/features/chat/lib/agents.ts`
- Current agent mapping:
  - `fast` -> `llama-3.1-8b-instant` (default)
  - `balanced` -> `openai/gpt-oss-20b`
  - `deep` -> `llama-3.3-70b-versatile`
- Current anti-abuse policy:
  - global limit: 10 messages/day per IP
  - `fast`: 10/day, 5s cooldown
  - `balanced`: 6/day, 20s cooldown
  - `deep`: 3/day, 45s cooldown
- Guardrails:
  - Server always resolves unknown `agentId` to `fast`.
  - Do not expose arbitrary model IDs from client input.
  - Keep `fast` as default to reduce free-tier quota pressure.
  - Keep KV warm with Vercel Cron (`vercel.json`) when using free-tier Upstash to reduce inactivity archival risk.

## Testing strategy

- Unit tests for parsing/validation utilities.
- Route-level tests for error/status handling.
- One smoke integration test for each new AI endpoint.
- Keep test output compact to avoid context bloat when run by agents.

## Prompt update policy

- Prompt changes require:
  - behavior note in PR/change log
  - at least one before/after example input-output pair (in docs or test fixtures)
- Avoid embedding long static bios/content in every request; retrieve only what is needed.
