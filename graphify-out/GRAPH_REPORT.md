# Graph Report - .  (2026-05-04)

## Corpus Check
- 115 files · ~130,178 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 249 nodes · 209 edges · 78 communities detected
- Extraction: 73% EXTRACTED · 27% INFERRED · 0% AMBIGUOUS · INFERRED: 56 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]

## God Nodes (most connected - your core abstractions)
1. `Root Agent Instructions` - 12 edges
2. `Project README` - 12 edges
3. `Button` - 7 edges
4. `ComponentSlots` - 6 edges
5. `Profile Card Badge Image` - 6 edges
6. `Open Graph Social Preview Image` - 6 edges
7. `Context Engineering Principles` - 5 edges
8. `Implementation Playbook` - 5 edges
9. `Project Map` - 5 edges
10. `Markdown Renderer` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Project README` --references--> `Htet Aung Lin Resume`  [INFERRED]
  README.md → public/HTET_AUNG_LIN_RESUME.pdf
- `app route layout` --implements--> `Site Shell and Global Providers`  [INFERRED]
  src/app/(app)/layout.tsx → agent_docs/project-map.md
- `blog route layout` --implements--> `Blog Content Pipeline`  [INFERRED]
  src/app/(app)/(blog)/layout.tsx → agent_docs/project-map.md
- `Blog Post Page` --implements--> `SEO Metadata and Discovery`  [INFERRED]
  src/app/(app)/(blog)/blog/[slug]/page.tsx → agent_docs/project-map.md
- `Htet Aung Lin Personal Brand Identity` --rationale_for--> `Signature Mark`  [INFERRED]
  src/components/footer.tsx → public/signature.svg

## Hyperedges (group relationships)
- **Blog Content Pipeline** — blog_content_pipeline, source_config_ts, src_app_app_blog_api_search_route_ts, src_app_app_blog_blog_page_tsx, src_app_app_blog_blog_slug_page_tsx, src_app_app_blog_layout_tsx [INFERRED 0.85]
- **Site Metadata and Discovery** — seo_metadata_and_discovery, src_app_layout_tsx, src_app_robots_ts, src_app_sitemap_ts [INFERRED 0.88]
- **Site Shell Provider Stack** — site_shell_and_global_providers, src_app_layout_tsx, src_app_app_layout_tsx, src_app_app_blog_layout_tsx [INFERRED 0.83]
- **Project Browsing Flow** — projects_page, project_detail_page, shared_project_dataset [INFERRED 0.84]
- **Stacked Visual Carousels** — card_stack, image_stack, stacked_auto_flip_carousel [INFERRED 0.90]
- **Site Chrome Navigation** — header, footer, site_navigation_chrome [INFERRED 0.76]
- **Avatar Component Family** — ui_avatar_Avatar, ui_avatar_AvatarGroup, ui_avatar_AvatarImage, ui_avatar_AvatarFallback [INFERRED 0.95]
- **Decorative Surface Treatments** — background_texture_BackgroundImageTexture, grainy_overlay_GrainyOverlay, dashed_divider_DashedDivider, dashed_line_DashedLine, light_rays_animation_LightRaysAnimation [INFERRED 0.80]
- **Animated Content Effects** — fade_animation_FadeStaggeredAnimation, fade_animation_FadeAnimation, typing_animation_TypingAnimation, animated_gradient_text_AnimatedGradientText [INFERRED 0.78]
- **Form Field Primitives** — input, textarea, label [INFERRED 0.80]
- **Overlay Primitives** — popover, dropdown_menu, tooltip [INFERRED 0.80]
- **Site Link Collections** — main_pages, side_quests, other_pages, social_links [INFERRED 0.74]
- **Chat Conversation Flow** — message_preview_message, prompt_area_component, suggested_questions_component [INFERRED 0.80]
- **Project Presentation Flow** — selected_project_feature, project_detail_view, project_showcase_card [INFERRED 0.88]
- **Markdown Rendering Pipeline** — markdown_renderer, parse_markdown_blocks, parse_incomplete_markdown [EXTRACTED 0.93]
- **Responsive Screen Helpers** — use_media_query_useMediaQuery, use_screen_size_SCREEN_SIZES, use_screen_size_useIsMobile, use_screen_size_useIsTablet, use_screen_size_useIsDesktop, use_screen_size_useScreenSizes [INFERRED 0.84]
- **Blog Source API** — source_blogSource, source_getBlogPost, source_getBlogPosts, source_pageBlogTree, source_BlogPost [INFERRED 0.80]
- **Structured Data Pipeline** — site_config_siteConfig, utils_absoluteUrl, structured_data_getPersonStructuredData, structured_data_getWebSiteStructuredData, structured_data_getArticleStructuredData, structured_data_getBreadcrumbStructuredData [INFERRED 0.85]

## Communities

### Community 0 - "Community 0"
Cohesion: 0.18
Nodes (19): Advanced AI Guardrails, Code Organization Guide, Context Engineering Principles, Dependencies and Doc Packages, Generative AI Extension Guide, i18n Plan, Implementation Playbook, Root Agent Instructions (+11 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (10): Blog Category Filtering, Blog Collection Schema, Blog Post Experience, Blog Search Index, robots(), SEO Metadata and Discovery, Blog Search API Route, Blog List Page (+2 more)

### Community 2 - "Community 2"
Cohesion: 0.15
Nodes (10): About, BasicMarkdown, Cloudinary Avatar, CloudinaryImage, Cloudinary Media Wrapper, getAgeFromDOB, getMDXComponents, GoBackButton (+2 more)

### Community 3 - "Community 3"
Cohesion: 0.18
Nodes (8): AgentSwitcher, Button, ChatView, CodeBlock, CodeBlockContent, CodeBlockCopyButton, highlight, Toaster

### Community 4 - "Community 4"
Cohesion: 0.17
Nodes (11): Project Map, Blog Content Pipeline, RootLayout(), Site Shell and Global Providers, blog route layout, app route layout, PersonStructuredData, WebSiteStructuredData (+3 more)

### Community 5 - "Community 5"
Cohesion: 0.25
Nodes (8): Project Detail Breadcrumbs, Project Detail Metadata from Project Data, Project Detail Page, Projects Cover Animation Gating, Cookie Bridge for Cover Animation, Projects Page, Projects Year Filter Tabs, Shared Project Dataset

### Community 6 - "Community 6"
Cohesion: 0.32
Nodes (8): ComponentSlots, createContext, DropdownMenu, Input, Label, Popover, SlotsToClasses, Textarea

### Community 7 - "Community 7"
Cohesion: 0.36
Nodes (8): Dark Editorial Layout, Htet Aung Lin, Open Graph Social Preview Image, Personal Branding, Portfolio Bio Copy, Portrait of Htet Aung Lin, Signature Mark, Social Preview Metadata Purpose

### Community 8 - "Community 8"
Cohesion: 0.33
Nodes (7): Markdown Renderer, Chat Message Preview, Parse Incomplete Markdown, Parse Markdown Into Blocks, Prompt Area, YouTube Remark Plugin, Suggested Questions

### Community 9 - "Community 9"
Cohesion: 0.48
Nodes (7): Use Media Query Options, useMediaQuery Hook, Screen Size Breakpoints, useIsDesktop Hook, useIsMobile Hook, useIsTablet Hook, useScreenSizes Hook

### Community 10 - "Community 10"
Cohesion: 0.38
Nodes (7): Centered Single-Line Layout, High-Contrast Monochrome Palette, htetaunglin.coder Wordmark, Minimalist Badge Design, Personal Brand Identity, Profile Card Badge Image, Rounded Geometric Display Typeface

### Community 11 - "Community 11"
Cohesion: 0.6
Nodes (5): Project Catalog, Project Detail, Project Showcase, Project Team Member Lookup, Team Member Registry

### Community 12 - "Community 12"
Cohesion: 0.4
Nodes (5): BlogPost Type, blogSource Loader, getBlogPost, getBlogPosts, pageBlogTree

### Community 13 - "Community 13"
Cohesion: 0.5
Nodes (4): Chat Agent Cooldown, Chat API Route, Chat Message Streaming, Chat Rate Limit Policy

### Community 14 - "Community 14"
Cohesion: 0.5
Nodes (1): SOCIAL_LINKS

### Community 15 - "Community 15"
Cohesion: 0.67
Nodes (3): About Page Age Revalidation, Current Age Correctness Rationale, About Page

### Community 16 - "Community 16"
Cohesion: 0.67
Nodes (3): Guest Book Comment Embed, Guest Book Fixed Illustration, Guest Book Page

### Community 17 - "Community 17"
Cohesion: 0.67
Nodes (3): Contribution Graph, Contributions, GitHub Contributions Fetcher

### Community 18 - "Community 18"
Cohesion: 0.67
Nodes (3): Image Viewer, Page Hero Image, getBlurDataUrl Helper

### Community 19 - "Community 19"
Cohesion: 0.67
Nodes (3): Badge, Button, Copy Button

### Community 20 - "Community 20"
Cohesion: 0.67
Nodes (3): Light Rays Animation, Ray Helper, createRays Helper

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (3): Favicon Asset, Lowercase H Monogram, Personal Brand Identity

### Community 22 - "Community 22"
Cohesion: 1.0
Nodes (3): Decorative Background Texture, Fabric of Squares Texture, Square-Grid Noise Pattern

### Community 23 - "Community 23"
Cohesion: 0.67
Nodes (3): Gray Speckled Paper Texture, Groovepaper Texture Asset, UI Background Texture

### Community 24 - "Community 24"
Cohesion: 1.0
Nodes (1): Tailwind PostCSS Pipeline

### Community 25 - "Community 25"
Cohesion: 1.0
Nodes (1): MDX + Next Integration

### Community 26 - "Community 26"
Cohesion: 1.0
Nodes (1): Error Fallback UI

### Community 27 - "Community 27"
Cohesion: 1.0
Nodes (2): Side Quests Collection View, Side Quests

### Community 28 - "Community 28"
Cohesion: 1.0
Nodes (2): Resume Page, Resume PDF Iframe

### Community 29 - "Community 29"
Cohesion: 1.0
Nodes (2): KV Keepalive Route, KV Keepalive TTL Policy

### Community 30 - "Community 30"
Cohesion: 1.0
Nodes (2): OG Route, OG Social Image Template

### Community 31 - "Community 31"
Cohesion: 1.0
Nodes (2): Chat Page, Chat View Entrypoint

### Community 32 - "Community 32"
Cohesion: 1.0
Nodes (2): OTHER_PAGES, SIDE_QUESTS

### Community 33 - "Community 33"
Cohesion: 1.0
Nodes (2): Contact Form, Send Email Action

### Community 34 - "Community 34"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Community 35"
Cohesion: 1.0
Nodes (2): Band, ProfileBadge3D

### Community 36 - "Community 36"
Cohesion: 1.0
Nodes (2): Theme Provider, Theme Switcher

### Community 37 - "Community 37"
Cohesion: 1.0
Nodes (2): Basic Markdown Inline Parser, Basic Markdown Parser

### Community 38 - "Community 38"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "Community 39"
Cohesion: 1.0
Nodes (2): YouTube Iframe, extractVideoId Helper

### Community 40 - "Community 40"
Cohesion: 1.0
Nodes (2): Comment Component, Giscus Comment Theme Sync

### Community 41 - "Community 41"
Cohesion: 1.0
Nodes (2): File Name Icon Map, Filename Icon Patterns

### Community 42 - "Community 42"
Cohesion: 1.0
Nodes (2): Contribution Graph, Contribution Graph Week Grouping

### Community 43 - "Community 43"
Cohesion: 1.0
Nodes (2): Error Display, Error Display Support Flow

### Community 44 - "Community 44"
Cohesion: 1.0
Nodes (0): 

### Community 45 - "Community 45"
Cohesion: 1.0
Nodes (2): Dashed Divider, Dashed Line

### Community 46 - "Community 46"
Cohesion: 1.0
Nodes (1): DashedDivider

### Community 47 - "Community 47"
Cohesion: 1.0
Nodes (2): Icons Collection, Zustand Icon

### Community 48 - "Community 48"
Cohesion: 1.0
Nodes (2): BreadcrumbListStructuredData, getBreadcrumbStructuredData

### Community 49 - "Community 49"
Cohesion: 1.0
Nodes (2): ArticleStructuredData, getArticleStructuredData

### Community 50 - "Community 50"
Cohesion: 1.0
Nodes (2): Gemini AI Client, System Prompt

### Community 51 - "Community 51"
Cohesion: 1.0
Nodes (2): Htet Aung Lin Personal Brand Identity, Signature Mark

### Community 52 - "Community 52"
Cohesion: 1.0
Nodes (2): Portfolio Brand Identity Mark, Stylized Lowercase H Monogram

### Community 53 - "Community 53"
Cohesion: 1.0
Nodes (2): Open in New Tab Action, Up-Right Arrow Icon

### Community 54 - "Community 54"
Cohesion: 1.0
Nodes (0): 

### Community 55 - "Community 55"
Cohesion: 1.0
Nodes (1): Main Layout

### Community 56 - "Community 56"
Cohesion: 1.0
Nodes (0): 

### Community 57 - "Community 57"
Cohesion: 1.0
Nodes (1): MAIN_PAGES

### Community 58 - "Community 58"
Cohesion: 1.0
Nodes (0): 

### Community 59 - "Community 59"
Cohesion: 1.0
Nodes (1): Chat Agents Registry

### Community 60 - "Community 60"
Cohesion: 1.0
Nodes (1): Tooltip Wrapper

### Community 61 - "Community 61"
Cohesion: 1.0
Nodes (1): Structured Data

### Community 62 - "Community 62"
Cohesion: 1.0
Nodes (0): 

### Community 63 - "Community 63"
Cohesion: 1.0
Nodes (1): Avatar

### Community 64 - "Community 64"
Cohesion: 1.0
Nodes (1): Avatar Group

### Community 65 - "Community 65"
Cohesion: 1.0
Nodes (1): Avatar Image

### Community 66 - "Community 66"
Cohesion: 1.0
Nodes (1): Avatar Fallback

### Community 67 - "Community 67"
Cohesion: 1.0
Nodes (1): Grainy Overlay

### Community 68 - "Community 68"
Cohesion: 1.0
Nodes (1): Background Image Texture

### Community 69 - "Community 69"
Cohesion: 1.0
Nodes (1): Animated Gradient Text

### Community 70 - "Community 70"
Cohesion: 1.0
Nodes (1): Profile

### Community 71 - "Community 71"
Cohesion: 1.0
Nodes (1): Signature

### Community 72 - "Community 72"
Cohesion: 1.0
Nodes (0): 

### Community 73 - "Community 73"
Cohesion: 1.0
Nodes (1): Typing Animation

### Community 74 - "Community 74"
Cohesion: 1.0
Nodes (1): useIsomorphicLayoutEffect

### Community 75 - "Community 75"
Cohesion: 1.0
Nodes (1): useSound Hook

### Community 76 - "Community 76"
Cohesion: 1.0
Nodes (1): Fonts Collection

### Community 77 - "Community 77"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **118 isolated node(s):** `Tailwind PostCSS Pipeline`, `MDX + Next Integration`, `Blog Collection Schema`, `Error Fallback UI`, `app route layout` (+113 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 24`** (2 nodes): `postcss.config.mjs`, `Tailwind PostCSS Pipeline`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (2 nodes): `MDX + Next Integration`, `next.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (2 nodes): `Error Fallback UI`, `global-error.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (2 nodes): `Side Quests Collection View`, `Side Quests`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (2 nodes): `Resume Page`, `Resume PDF Iframe`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (2 nodes): `KV Keepalive Route`, `KV Keepalive TTL Policy`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (2 nodes): `OG Route`, `OG Social Image Template`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (2 nodes): `Chat Page`, `Chat View Entrypoint`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (2 nodes): `OTHER_PAGES`, `SIDE_QUESTS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (2 nodes): `Contact Form`, `Send Email Action`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (2 nodes): `LazyContact()`, `lazy-contact.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (2 nodes): `Band`, `ProfileBadge3D`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (2 nodes): `Theme Provider`, `Theme Switcher`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (2 nodes): `Basic Markdown Inline Parser`, `Basic Markdown Parser`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (2 nodes): `startFlipping()`, `card-stack.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (2 nodes): `YouTube Iframe`, `extractVideoId Helper`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (2 nodes): `Comment Component`, `Giscus Comment Theme Sync`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (2 nodes): `File Name Icon Map`, `Filename Icon Patterns`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (2 nodes): `Contribution Graph`, `Contribution Graph Week Grouping`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (2 nodes): `Error Display`, `Error Display Support Flow`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (2 nodes): `theme-image.tsx`, `ThemeImage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (2 nodes): `Dashed Divider`, `Dashed Line`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (2 nodes): `DashedDivider`, `blog-post-showcase.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 47`** (2 nodes): `Icons Collection`, `Zustand Icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 48`** (2 nodes): `BreadcrumbListStructuredData`, `getBreadcrumbStructuredData`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 49`** (2 nodes): `ArticleStructuredData`, `getArticleStructuredData`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 50`** (2 nodes): `Gemini AI Client`, `System Prompt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 51`** (2 nodes): `Htet Aung Lin Personal Brand Identity`, `Signature Mark`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (2 nodes): `Portfolio Brand Identity Mark`, `Stylized Lowercase H Monogram`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 53`** (2 nodes): `Open in New Tab Action`, `Up-Right Arrow Icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 54`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 55`** (1 nodes): `Main Layout`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 56`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 57`** (1 nodes): `MAIN_PAGES`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 58`** (1 nodes): `experience.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 59`** (1 nodes): `Chat Agents Registry`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 60`** (1 nodes): `Tooltip Wrapper`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 61`** (1 nodes): `Structured Data`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 62`** (1 nodes): `image-stack.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 63`** (1 nodes): `Avatar`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 64`** (1 nodes): `Avatar Group`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 65`** (1 nodes): `Avatar Image`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 66`** (1 nodes): `Avatar Fallback`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 67`** (1 nodes): `Grainy Overlay`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 68`** (1 nodes): `Background Image Texture`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 69`** (1 nodes): `Animated Gradient Text`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 70`** (1 nodes): `Profile`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 71`** (1 nodes): `Signature`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 72`** (1 nodes): `fade-animation.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 73`** (1 nodes): `Typing Animation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 74`** (1 nodes): `useIsomorphicLayoutEffect`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 75`** (1 nodes): `useSound Hook`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 76`** (1 nodes): `Fonts Collection`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 77`** (1 nodes): `site-config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Project Map` connect `Community 4` to `Community 0`, `Community 1`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `SEO Metadata and Discovery` connect `Community 1` to `Community 4`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `Button` connect `Community 3` to `Community 2`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Profile Card Badge Image` (e.g. with `Personal Brand Identity` and `Minimalist Badge Design`) actually correct?**
  _`Profile Card Badge Image` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Tailwind PostCSS Pipeline`, `MDX + Next Integration`, `Blog Collection Schema` to the rest of the system?**
  _118 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._