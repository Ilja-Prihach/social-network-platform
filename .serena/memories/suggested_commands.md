# Suggested Commands

## Setup / run

- `npm ci` - install dependencies
- `npm run dev` - start dev server
- `npm run build` - build production bundle
- `npm run start` - start built app

## Quality checks

- `npm run lint` - eslint
- `npm run stylelint` - SCSS lint
- `npm run stylelint:fix` - auto-fix SCSS lint issues

## Validation policy reminders

- TS/TSX/JS/JSX changes: run `npm run lint`
- SCSS changes: run `npm run stylelint` (and lint if TS/TSX also changed)
- Routing/config/middleware/auth/BFF/API changes: run `npm run lint && npm run build`
- Dependency changes: run `npm run lint && npm run build`

## Useful Darwin shell commands

- `ls -la`, `cd <dir>`, `pwd`
- `rg <pattern>` / `rg --files`
- `find . -name "<glob>"`
- `git status`, `git diff`, `git log --oneline -n 20`
