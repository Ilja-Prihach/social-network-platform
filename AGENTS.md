# Repository Guidelines

## Project Structure & Module Organization

This repository is a Next.js App Router project with Feature-Sliced Design (FSD) under `src/`.

- `app/`: App Router entrypoints (`layout.tsx`, locale pages, API routes) that re-export from `src/pages/*`.
- `src/app/`: shared app-level layouts/providers.
- `src/pages/`: route-level page modules (UI + metadata stubs in `src/pages/_`).
- `src/widgets/`, `src/features/`, `src/entities/`, `src/shared/`: FSD layers for composition, business logic, domain models, and common utilities.
- `public/`: static assets.
- Root infra: `middleware.ts`, `instrumentation.ts`, `Dockerfile`, `deployment.yaml`, `nginx.conf`.

Prefer imports via alias `@/*` (mapped to `src/*`) instead of relative deep paths.

## Build, Test, and Development Commands

- `npm run dev`: start local Next.js dev server.
- `npm run build`: create production build.
- `npm run start`: run built app.
- `npm run lint`: run ESLint for TS/JS and architecture boundaries.
- `npm run stylelint`: lint all `*.scss`.
- `npm run stylelint:fix`: auto-fix SCSS issues where possible.

Current repo does not define a dedicated automated test script yet.

## Coding Style & Naming Conventions

- TypeScript with `strict` mode enabled; keep types explicit at public boundaries.
- Prettier: 2 spaces, single quotes, semicolons, trailing commas, max width 100.
- SCSS class names must match `^([a-z][a-z0-9]*)(_[a-z0-9]+)*$` (snake-style segments).
- Respect FSD dependency rules enforced by ESLint boundaries:
  `pages -> widgets -> features -> entities -> shared`.

## Testing Guidelines

When adding tests, colocate near feature/page code and use `*.test.ts(x)` or `*.spec.ts(x)` naming. Prioritize coverage for:

- auth/API route handlers in `app/api/*`
- form validation and critical user flows
- edge-case handling in shared utilities

Include test run instructions in `package.json` when introducing a framework.

## Commit & Pull Request Guidelines

Recent history shows short subjects (`fix`, `add`) plus occasional conventional messages (`chore(deploy): ...`, `docs: ...`). Use clear, imperative subjects and prefer Conventional Commit style:

- `feat(auth): add token refresh route`
- `fix(profile): handle missing avatar`

For PRs, include:

- concise problem/solution description
- linked issue/ticket (if available)
- screenshots/video for UI changes
- notes on config/env or migration impact
