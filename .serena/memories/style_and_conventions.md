# Style and Conventions

- TypeScript strict mode is enabled.
- Keep explicit types at module boundaries.
- Prettier style: single quotes, semicolons, trailing commas, print width 100.
- Styling uses SCSS modules.
- SCSS class naming pattern: `^([a-z][a-z0-9]*)(_[a-z0-9]+)*$`.
- Preserve architecture boundaries:
  - pages -> widgets/features/entities/shared
  - widgets -> features/entities/shared
  - features -> entities/shared
  - entities -> shared
  - shared -> shared
- Do not bypass boundaries with relative import workarounds or lint disables.
- Keep changes focused and avoid broad refactors unless requested.
- Do not add/remove/upgrade dependencies unless explicitly requested.
- Sensitive areas (`app/api/**`, `src/shared/api/server/**`, middleware/config/infra/env files) require tightly scoped edits and stronger validation when touched.
