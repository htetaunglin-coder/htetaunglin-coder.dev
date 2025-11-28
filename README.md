# Personal Portfolio

My personal portfolio built with Next.js, showcasing my projects, blog posts, and a bit about who I am.

This is **version 2** of my portfolio.  
If you'd like to see the old version, you can check it out here:  
👉 [Portfolio v1](https://htetaunglin-coder.netlify.app)

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

- [ ] Multi-model AI chat support
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

4. **Start the development server**

```bash
  npm run dev
```

## 🙏 Acknowledgements

### Inspirations

- [Clarence](https://theodorusclarence.com) - Menu design and blog layout
- [Chánh Đại](https://chanhdai.com) - Voice feature idea

### Tools & Resources

- [Ultracite](https://www.ultracite.ai) - Better linting and formatting DX with Biome
- [Aceternity UI](https://ui.aceternity.com) - Beautiful animated components
- [Magic UI](https://magicui.design) - Beautiful animated components
- [Unsplash](https://unsplash.com) - Creative photography

## License

Licensed under the **MIT License**.
