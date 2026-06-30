# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm run lint     # ESLint check
```

No test suite is configured.

## Environment Variables

Required for Notion CMS (dev and production):

```
NOTION_TOKEN=           # Notion integration secret
NOTION_DATABASE_ID=     # ID of the Notion database
REVALIDATE_SECRET=      # Token for the /api/revalidate webhook
NEXT_PUBLIC_SITE_URL=   # Full URL, e.g. https://negativadoefeliz.com.br
```

If `NOTION_TOKEN` and `NOTION_DATABASE_ID` are absent the site automatically falls back to MDX files in `content/posts/`.

## Architecture

**"Negativado e Feliz"** — a Brazilian Portuguese personal-finance blog with dark humor. Content is served from Notion CMS with a local MDX fallback layer.

### Data layer (`lib/`)

All pages must import exclusively from `lib/data.ts` — never from `lib/notion.ts` or `lib/posts.ts` directly.

| File | Role |
|---|---|
| `lib/data.ts` | Public API — routes calls to Notion or MDX fallback |
| `lib/notion.ts` | Notion API client + `notion-to-md` conversion |
| `lib/notion-types.ts` | `NotionPost` interface |
| `lib/posts.ts` | MDX file reader from `content/posts/` |
| `lib/types.ts` | Shared `PostSummary` / `PostDetail` interfaces |
| `lib/utils.ts` | Utilities (e.g. `formatDate`) |

`lib/data.ts` tries Notion first; on error or empty result it silently falls back to MDX.

### Notion database schema

The integration expects these Notion properties:

| Property | Type |
|---|---|
| `Title` or `Name` | title |
| `Slug` | rich_text |
| `Description` | rich_text |
| `Category` | select |
| `Published` | checkbox |
| `Date` | date |
| `Cover` | files (or page cover) |
| `ReadingTime` | rich_text |
| `Author` | rich_text |

Only pages with `Published = true` are returned.

### Routing

All routes use the Next.js App Router. All data-fetching pages export `export const revalidate = 60` (ISR, 60-second TTL).

| Route | File |
|---|---|
| `/` | `app/page.tsx` |
| `/blog` | `app/blog/page.tsx` |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` |
| `/sobre` | `app/sobre/page.tsx` |
| `/contato` | `app/contato/page.tsx` |
| `/politica-de-privacidade` | `app/politica-de-privacidade/page.tsx` |
| `POST /api/revalidate` | `app/api/revalidate/route.ts` |

### On-demand revalidation

`POST /api/revalidate?secret=<REVALIDATE_SECRET>` (or header `x-revalidate-secret`) revalidates `/`, `/blog`, and `/blog/[slug]`. Hook this up to Notion webhooks to clear ISR cache on publish.

### Blog article rendering

`app/blog/[slug]/page.tsx` fetches content as Markdown via `notion-to-md`, then renders it with `<MDXRemote>` (server component). An `<AdSenseSlot />` placeholder is injected programmatically after the 3rd paragraph.

### Styling

Tailwind CSS v4 (`@tailwindcss/postcss`). Design tokens are hardcoded inline:
- Background: `#080808`
- Foreground: `#F5F5F5`
- Accent / brand red: `#CC0000`
- Muted: `#A0A0A0`

Fonts loaded via `next/font/google`: `Inter` (`--font-inter`, `font-sans`) and `Bebas Neue` (`--font-bebas`, `font-heading`).

Dark mode is default (`defaultTheme="dark"`) via `next-themes`, toggled with `ThemeProvider` wrapping the entire layout.

### Path alias

`@/*` maps to the project root — use `@/lib/...`, `@/components/...`, etc.
