# AGENTS.md

Project-specific operating guide for coding agents in this repository (v2 strict mode).

## Scope

- Applies to the entire repository (`/frontend`) unless a nested `AGENTS.md` overrides it.

## Operating Mode

- Default mode: strict..
- Principle: everything is allowed only when in-task and explicitly requested or clearly required to complete the task.

## Workflow Orchestration

### 1. Plan Node Default

- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately — don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy

- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop

- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done

- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)

- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes — don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing

- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests — then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.

## Project Snapshot

- Stack: Next.js (App Router), React 19, TypeScript, Sass modules, Zustand, TanStack Query, Intlayer.
- Package manager: npm (`package-lock.json` is present).
- Main source root: `src/`.
- Routing root: `app/` (localized routes under `app/[locale]/...`).
- API layer: Next route handlers under `app/api/...`, proxying to backend through shared BFF helpers.

## Repository Layout

- `app/`: Next.js routes, layouts, and API route handlers.
- `src/pages`: page-level UI modules consumed by `app/[locale]` routes.
- `src/widgets`, `src/features`, `src/entities`, `src/shared`: layered frontend architecture.
- `src/shared/api/server`: server-side BFF helpers (`bffFetch`, cookie forwarding, normalized responses).
- `public/`: static assets and mock images.

## Architecture Constraints

- ESLint `boundaries` plugin is enabled and enforced.
- Allowed imports by layer:

1. `pages` -> `widgets`, `features`, `entities`, `shared`
2. `widgets` -> `features`, `entities`, `shared`
3. `features` -> `entities`, `shared`
4. `entities` -> `shared`
5. `shared` -> `shared`

- Path alias: `@/*` -> `src/*` (from `tsconfig.json`).
- Do not bypass boundaries with relative-import workarounds, barrel hacks, or disabled lint rules unless explicitly requested.

## Localization Rules

- Intlayer is integrated (`next-intlayer`) and middleware-based locale routing is active.
- Supported locales are configured in `intlayer.config.ts`.
- App routes are locale-scoped under `app/[locale]/...`.
- Keep localized content in existing `*.content.ts` files where applicable.

## API/BFF Conventions

- Prefer server route handlers in `app/api/*` as backend proxies instead of direct client-side sensitive calls.
- Use `bffFetch` from `src/shared/api/server/bffFetch.ts` for backend communication.
- Preserve cookie forwarding behavior with `forwardSetCookie` and response shaping with `buildJsonResponse`.
- Keep auth token/cookie logic server-side; do not move it into client components.
- Before creating/changing routes in `app/api/**` or client requests that depend on BFF endpoints, read and follow `BFF.md`.
- Keep `BFF.md` updated when adding/removing/changing BFF routes, auth flows, or cookie/refresh behavior.

## Sensitive Areas

- Sensitive paths include:

1. `app/api/**`
2. `src/shared/api/server/**`
3. `middleware.ts`
4. `next.config.ts`
5. `intlayer.config.ts`
6. `.github/**`, `Dockerfile`, `deployment.yaml`, `Jenkinsfile`, `nginx.conf`
7. `.env*`

- Changes in sensitive areas are allowed when explicitly requested by the user.
- For sensitive changes, agent must:

1. Keep changes tightly scoped
2. Run stronger validation (see Validation Policy)
3. Report risks and behavior impact explicitly

## Environment Variables

- Expected keys in this project:

1. `API_URL`
2. `NEXT_PUBLIC_API_URL`
3. `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
4. `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`

- Never hardcode secrets or production URLs.
- Never print or expose secret values in logs or summaries.

## Coding Conventions

- TypeScript strict mode is on; keep types explicit at module boundaries.
- Follow existing style:

1. Prettier: single quotes, semicolons, trailing commas, print width 100
2. SCSS modules for component styles
3. Class naming for SCSS must satisfy stylelint pattern: `^([a-z][a-z0-9]*)(_[a-z0-9]+)*$`

- Avoid broad refactors unless explicitly requested.

## Dependency Policy

- Do not add, remove, or upgrade dependencies unless the user explicitly asks.
- If dependency changes are required to complete the task, call this out before changing `package.json` or `package-lock.json`.

## Forbidden Changes (Without Explicit Request)

- Do not edit:

1. `.env*`
2. CI/CD and infra files (`.github/**`, `Dockerfile`, `deployment.yaml`, `Jenkinsfile`, `nginx.conf`)
3. Lockfiles (`package-lock.json`) as a side effect of unrelated edits

- Do not perform large-scale renames/moves or cross-layer refactors.
- Do not weaken lint/style/type rules to make code pass.

## Commands

- Install deps: `npm ci`
- Run dev server: `npm run dev`
- Build: `npm run build`
- Start prod build: `npm run start`
- Lint: `npm run lint`
- SCSS lint: `npm run stylelint`
- Auto-fix SCSS lint: `npm run stylelint:fix`

## Validation Checklist

- After code changes, run the narrowest relevant checks first.
- Minimum expectation by change type:

1. TS/TSX/JS/JSX only: `npm run lint`
2. SCSS touched: `npm run stylelint` (and `npm run lint` if TS/TSX also changed)
3. Routing/config/middleware/auth/BFF/API changes: `npm run lint && npm run build`
4. Dependency changes: `npm run lint && npm run build`

- If a check cannot be run, state the reason explicitly.

## Change Size Control

- Keep edits minimal and task-scoped.
- If more than 10 files are changed, include a brief justification grouped by feature area.

## Git Hooks

- Husky pre-commit runs `npx lint-staged`.
- Keep staged files passing eslint/prettier/stylelint to avoid commit failures.

## Agent Behavior Expectations

- Make focused changes only in files relevant to the task.
- Preserve existing folder/layer boundaries.
- Prefer reusing existing abstractions/components over introducing parallel patterns.
- In final reports, include:

1. What changed
2. Why it changed
3. Which checks were run and results
4. Any skipped checks and why
5. Sensitive-area impact (only when applicable)
