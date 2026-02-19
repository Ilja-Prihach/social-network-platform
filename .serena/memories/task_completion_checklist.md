# Task Completion Checklist

- Ensure edits are minimal and task-scoped.
- Confirm layer boundary rules are respected.
- Run required validations based on touched files:
  - TS/TSX/JS/JSX -> `npm run lint`
  - SCSS -> `npm run stylelint` (+ lint if TS/TSX changed)
  - Routing/config/middleware/auth/BFF/API/dependency changes -> `npm run lint && npm run build`
- If checks are skipped, document why.
- If sensitive areas were changed, explicitly report behavioral impact and risks.
- Do not modify `.env*`, infra/CI files, or lockfile unless explicitly requested.
- Keep auth/cookie logic server-side and preserve BFF conventions.
- Before finishing, summarize what changed, why, and validation results.
