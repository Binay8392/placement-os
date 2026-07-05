# PrepTrack OS Architecture

## Product boundary

PrepTrack OS currently ships as a single React application with local-first progress data, Firebase authentication, and Supabase serverless capabilities. The UI is organized by product module under `src/pages`, while shared shell, navigation, and UI primitives live under `src/components`.

The dashboard is an aggregation layer. It does not maintain a second copy of progress data: readiness, focus time, task completion, habits, applications, and recommendations are calculated from the same Zustand store used by their owning modules.

## Runtime flow

```text
Browser
  ├─ Firebase Authentication
  ├─ React Router product modules
  ├─ Zustand persisted progress store
  ├─ Supabase client
  └─ Supabase Edge Functions
       ├─ AI chat
       ├─ Mock interview
       └─ Reminder delivery
```

## Frontend layers

### Application shell

`AppShell` owns the responsive sidebar, mobile navigation, top bar, global command palette, theme control, account controls, and floating AI entry point. Route pages remain responsible for their own feature content.

### Feature modules

Each route-level feature owns its page components and calls shared domain hooks or services. Larger modules such as the daily planner, résumé builder, and mock interview already use dedicated component folders.

### Shared state

`src/lib/store.ts` contains the persisted user preparation state and domain mutations. Dashboard calculations are derived with memoized selectors so the overview stays consistent with every underlying feature.

### Integrations

- Firebase owns identity and session state.
- Supabase provides database access and Edge Functions.
- AI requests are streamed through the `ai-chat` Edge Function so provider credentials stay server-side.

## Readiness model

The placement readiness score is a transparent weighted aggregate:

| Area | Weight | Inputs |
| --- | ---: | --- |
| Coding and DSA | 40% | Coding target progress and DSA roadmap mastery |
| Core CS | 20% | Completed core-CS tasks |
| Aptitude | 15% | Practice volume and accuracy |
| Interviews | 15% | Interview preparation and application stages |
| Consistency | 10% | Active streak and weekly focus days |

Each component is capped at 100. Missing activity contributes zero rather than fabricated starter data.

## Security boundaries

- Protected routes require an authenticated Firebase session.
- AI provider credentials belong only in Supabase Function secrets.
- Browser environment variables are publishable project identifiers and keys only.
- Authorization-sensitive database tables should use row-level security tied to the authenticated user identifier.

## Evolution toward the target platform

The master brief calls for Next.js, FastAPI, PostgreSQL, Redis, Celery, Meilisearch, and WebSockets. That architecture should be introduced incrementally around stable domain contracts:

1. Move persisted Zustand entities behind typed repository interfaces while keeping optimistic local state.
2. Add a versioned API contract for questions, attempts, revision scheduling, notes, and applications.
3. Migrate route modules to a Next.js App Router frontend once the API boundary is stable.
4. Introduce FastAPI services for execution, search indexing, revision jobs, and AI orchestration.
5. Move background work to Redis/Celery and real-time interview or contest events to WebSockets.

This avoids a flag-day rewrite and keeps the current product usable while backend capabilities mature.
