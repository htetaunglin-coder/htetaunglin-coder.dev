# Personal Portfolio

My personal portfolio built with Next.js, showcasing my projects, blog posts, and a bit about who I am.

This is **version 2** of my portfolio.  
If you'd like to see the old version, you can check it out here:  
👉 [Portfolio v1](https://htetaunglin-coder.netlify.app)

## Preview

<img width="1719" height="967" alt="portfolio-preview" src="https://github.com/user-attachments/assets/fef0cce3-a690-4b33-9464-48440f8cc232" />


## Tech Stack

- **Framework:** Next.js 16
- **Styling:** Tailwind CSS v4
- **Components:** [MijnUI](https://mijn-ui.vercel.app)
- **Animation:** Framer Motion
- **Linting:** Biome
- **Blog:** Fumadocs
- **Comments:** Giscus (for blog posts and guestbook)
- **Git Hooks:** Husky + Commitlint
- **Image Hosting:** Cloudinary
- **Rate Limiting:** Upstash + Vercel KV
- **Email:** Resend
- **AI Chat:** Vercel AI SDK + Groq API

## Features

- Home, About (3D interactive badge), Projects with detail pages
- Blog with technical writing (comments via Giscus), Resume, Side Quests, Resources
- Guestbook with comments (powered by Giscus)
- AI-powered chat (10 messages/day limit via Groq)
- Contact form (rate limited via Resend)
- Light/Dark theme with image variants

## Roadmap

Things I ~~wish~~ would like to implement in the future:

- [x] Multi-model AI chat support
- [ ] Blog internationalization (English + Burmese)

## Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/htetaunglin-coder/htetaunglin-coder.dev.git
   ```

2. **Install dependencies**

   ```bash
   npm install # or: pnpm install / yarn install / bun install
   ```

3. **Add environment variables**
   Create a `.env.local` file and fill in the values (see `.env.example`).
   For AI chat and rate limiting, ensure `GROQ_API_KEY` and `KV_*` variables are set.
   For production cron keepalive, also set `CRON_SECRET`.

4. **Start the development server**

   ```bash
   npm run dev
   ```

## KV Keepalive Cron

- This repo includes a protected keepalive endpoint: `/api/cron/kv-keepalive`.
- Vercel Cron schedule is configured in `vercel.json` to run every 3 days.
- Vercel will send `Authorization: Bearer <CRON_SECRET>`, so set `CRON_SECRET` in project environment variables.

## Agent Documentation

This repo includes an agent-oriented documentation set for context-aware implementation:

- `AGENTS.md` - short root instructions for coding agents
- `agent_docs/project-map.md` - architecture and file map
- `agent_docs/implementation-playbook.md` - research -> plan -> implement -> verify workflow
- `agent_docs/code-organization.md` - colocation-first code organization conventions for this repo
- `agent_docs/i18n-burmese-english.md` - Burmese/English internationalization plan
- `agent_docs/generative-ai-extension.md` - advanced AI feature extension guide
- `agent_docs/dependencies-and-doc-packages.md` - dependency/docs package update process
- `agent_docs/context-engineering-principles.md` - principles adapted from HumanLayer references

## Lighthouse Scores

<img width="475" height="109" alt="Screenshot 2026-04-18 at 10 19 28 pm" src="https://github.com/user-attachments/assets/318ea081-e07b-4131-aff0-6f2211c7ede5" />


## 🙏 Acknowledgements

### Inspirations

- [Clarence](https://theodorusclarence.com) - Menu design and blog layout
- [Chánh Đại](https://chanhdai.com) - Voice feature idea

### Tools & Resources

- [Ultracite](https://www.ultracite.ai) - Better linting and formatting DX with Biome
- [Aceternity UI](https://ui.aceternity.com) - Beautiful animated components
- [Magic UI](https://magicui.design) - Beautiful animated components
- [Unsplash](https://unsplash.com) - Creative photography

## Support Me

If you found this useful and want to support my work, please ⭐ Star the repo!

## License

Licensed under the **MIT License**.
