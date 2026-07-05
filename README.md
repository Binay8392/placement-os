# PrepTrack OS

PrepTrack OS is a placement preparation workspace for engineering students. It brings daily planning, DSA and aptitude practice, focus tracking, company preparation, applications, résumé work, mock interviews, analytics, and AI support into one connected product.

## What is implemented

- A responsive placement dashboard with readiness scoring, weekly focus analytics, daily execution metrics, recommendations, and application awareness
- Keyboard-first global navigation with `Ctrl/Cmd + K`
- Daily planner, task tracker, study timer, habits, calendar, and reflection workflows
- DSA roadmap, coding progress, aptitude preparation, and company-specific task generation
- Company readiness, application tracking, résumé builder, and mock interviews
- AI tutor, community experiences, profile settings, light/dark themes, and mobile navigation
- Firebase authentication and Supabase-backed AI/serverless integrations
- Local-first progress persistence with Zustand

## Current stack

- Vite 5, React 18, and TypeScript
- Tailwind CSS and shadcn/ui
- Framer Motion and Recharts
- TanStack Query, React Hook Form, and Zod
- Zustand for the local-first application store
- Firebase Authentication
- Supabase database and Edge Functions

The product brief describes a future Next.js/FastAPI platform architecture. This repository already had a working Vite/Supabase product, so the implementation preserves that foundation instead of introducing a second framework beside it. See [Architecture](docs/ARCHITECTURE.md) for the current boundaries and an incremental migration path.

## Local development

Requirements:

- Node.js 20 or newer
- npm 10 or newer
- A Supabase project for AI and serverless features
- A Firebase project with the configured authentication providers enabled

Install and run:

```bash
npm install
npm run dev
```

Create `.env` with:

```bash
VITE_SUPABASE_PROJECT_ID=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_URL=
```

The development server is available at `http://localhost:8080`.

## Quality checks

```bash
npm run lint
npm run build
```

## Project map

```text
src/
  components/        Shared product shell and shadcn primitives
  hooks/             Feature and integration hooks
  integrations/      Generated Supabase client and types
  lib/               Store, services, and domain utilities
  pages/             Route-level product modules
supabase/
  functions/         AI chat, mock interview, and reminder functions
  migrations/        Database schema history
docs/
  ARCHITECTURE.md     System boundaries and evolution path
```

## Deployment

The Vite application is configured for Vercel with SPA route fallback. Supabase migrations and Edge Functions are deployed through the Supabase CLI.
