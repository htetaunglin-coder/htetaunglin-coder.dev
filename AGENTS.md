# AGENTS.md

This file is the root context for coding agents working in this repository. Keep this file concise and universally applicable. Load deeper docs from `agent_docs/` only when needed.

## Why this project exists

Personal portfolio for Htet Aung Lin, built with Next.js App Router. Primary goals:

- Present projects, writing, and profile content.
- Provide an AI chat experience about the portfolio owner.
- Stay maintainable, fast, and easy to extend.

## Core stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS v4
- Fumadocs MDX for blog content
- Vercel AI SDK (`ai`) + Groq chat model in API route
- Resend for contact email
- Upstash/Vercel KV for rate limiting
- Biome + Ultracite for lint/format checks
