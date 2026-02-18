# Project Overview

- Name: social-network-ai frontend
- Purpose: Localized Next.js frontend for a social network app, with BFF-style API proxy routes for backend communication.
- Stack: Next.js App Router, React 19, TypeScript, Sass modules, Zustand, TanStack Query, Intlayer.
- Package manager: npm (lockfile present).

## Structure

- `app/`: Next.js routes/layouts and API route handlers.
- `app/[locale]/...`: locale-scoped routes.
- `app/api/...`: server route handlers that proxy to backend.
- `src/pages`, `src/widgets`, `src/features`, `src/entities`, `src/shared`: layered architecture.
- `src/shared/api/server`: BFF helpers (`bffFetch`, cookie forwarding, normalized JSON responses).
- `public/`: static assets.

## Important constraints

- ESLint boundaries are enforced.
- Path alias: `@/*` -> `src/*`.
- Locale routing is middleware/intlayer based.
- Keep auth token/cookie handling server-side in API/BFF layers.
