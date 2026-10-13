# Social Network Platform

An archived, team-built social networking product developed as an internship project. This repository is a security-sanitized portfolio edition published with permission from the original contributors.

The codebase contains a user-facing application, a separate administration application, shared workspace packages, and a Next.js BFF layer for backend integration.

## Product highlights

- Email/password authentication, Google and GitHub OAuth, password recovery, and reCAPTCHA
- Server-side authentication through BFF route handlers with secure cookie forwarding
- User profiles, profile settings, avatar upload and crop, and active-session management
- Post creation with image upload, feed and profile views, editing, deletion, and pagination
- AI-assisted post translation
- Real-time notifications through WebSocket integration
- Subscription payment history
- Six locales, including RTL support for Hebrew
- Administration app with GraphQL authentication, user search, filtering, sorting, pagination, and moderation actions

## Architecture

```text
.
├── web/                 User-facing Next.js application
├── admin/               Administration Next.js application
└── packages/
    ├── auth-core/       Shared authentication logic
    ├── auth-ui/         Shared authentication UI
    ├── i18n-ui/         Shared locale controls
    └── layout-ui/       Shared application shells
```

The frontend follows a layered feature architecture and enforces import boundaries between pages, widgets, features, entities, and shared modules. Sensitive backend communication is proxied through route handlers instead of exposing authentication tokens to browser code.

## Technology

- Next.js 16, React 19, and TypeScript
- Sass Modules and a layered feature architecture
- TanStack Query and Zustand
- Apollo Client and GraphQL in the administration app
- Intlayer internationalization
- React Hook Form, WebSockets, and Next.js route handlers
- npm workspaces, ESLint, Stylelint, Prettier, and Husky

## Running locally

This repository contains the frontend only. A compatible backend API is required for authentication, profiles, posts, notifications, payments, and administration data.

```bash
npm ci
cp web/.env.example web/.env.local
cp admin/.env.example admin/.env.local
npm run dev
```

The user application starts on the default Next.js port. Start the administration application separately:

```bash
npm run dev:admin
```

Configure the following variables in the local environment files:

| Variable | Used by | Purpose |
| --- | --- | --- |
| `API_URL` | Web server | Server-side backend base URL |
| `NEXT_PUBLIC_API_URL` | Web and admin | Public backend base URL |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Web | Google OAuth client identifier |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Web | reCAPTCHA site key |

Never commit real environment values. The example files intentionally contain empty placeholders.

## Commands

```bash
npm run lint
npm run lint:admin
npm run stylelint
npm run build
npm run build:admin
```

## Team and attribution

This is a collaborative project, not a single-author codebase. The rewritten public history preserves the original authors, dates, commit messages, and merge structure while removing generated files, environment configuration, personal email addresses, and exposed client configuration.

See [CONTRIBUTORS.md](CONTRIBUTORS.md) for the contributors and their main areas of work. The complete contribution history remains available through Git:

```bash
git shortlog -sne HEAD
```

## Project status

The original team project is no longer under active development. This portfolio edition is maintained as an archive and technical case study.

No open-source license is granted at this time. The source is publicly available for portfolio review; copyright remains with its respective contributors.
