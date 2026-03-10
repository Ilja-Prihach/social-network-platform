# BFF Overview

## Purpose

This document describes how the BFF layer works in this repository and records current rules for auth/cookie behavior.

Scope:

- `app/api/**` route handlers
- `src/shared/api/server/bffFetch.ts`
- `src/shared/api/server/cookies.ts`
- `src/shared/api/server/bffResponse.ts`

## High-Level Flow

1. Client calls local Next.js API route (for example `/api/auth/*`, `/api/posts`, `/api/public-user`).
2. Route handler proxies request via `bffFetch(...)`.
3. `bffFetch` calls backend at `${API_URL}<backend_path>`.
4. BFF forwards backend `Set-Cookie`, keeps auth token logic server-side, and normalizes response payloads.

## Core Components

### `bffFetch` (`src/shared/api/server/bffFetch.ts`)

- Supports two forms:
  - `bffFetch('/path', options)` -> `{ res, setCookie }`
  - `bffFetch(nextResponse, '/path', options)` -> writes cookies to `nextResponse`, returns `Response`
- Reads access cookie (`access_token` in dev, `__Host-access_token` in prod) and sets `Authorization: Bearer <token>`.
- Handles refresh on `401` with single-flight (`refreshPromise`), then retries original request.
- Extracts `accessToken` from auth JSON responses, removes it from payload, persists it in HttpOnly cookie.

### `cookies` helpers (`src/shared/api/server/cookies.ts`)

- `getSetCookie(...)`: safely reads all `Set-Cookie` headers.
- `rewriteAccessCookieForProd(...)`: rewrites access cookie to `__Host-access_token` in production.
- `forwardSetCookie(...)`: appends rewritten cookie headers to `NextResponse`.

### `buildJsonResponse` (`src/shared/api/server/bffResponse.ts`)

- Normalizes backend responses to stable JSON output.
- Preserves status and handles empty/non-JSON bodies safely.

## Route Map

Auth routes:

- `POST /api/auth/login` -> backend `/api/v1/auth/login`
- `POST /api/auth/logout` -> backend `/api/v1/auth/logout`
- `GET /api/auth/me` -> backend `/api/v1/auth/me`
- `POST /api/auth/update` -> backend `/api/v1/auth/update`
- `POST /api/auth/registration` -> backend `/api/v1/auth/registration`
- `POST /api/auth/registration-email-resending` -> backend `/api/v1/auth/registration-email-resending`
- `POST /api/auth/registration-confirmation` -> backend `/api/v1/auth/registration-confirmation`
- `POST /api/auth/password-recovery` -> backend `/api/v1/auth/password-recovery`
- `POST /api/auth/new-password` -> backend `/api/v1/auth/new-password`
- `GET /api/auth/github/login` -> backend OAuth entrypoint
- `POST /api/auth/github/update-tokens` -> backend `/api/v1/auth/github/update-tokens`
- `POST /api/auth/github/accept` -> local cookie set from provided access token
- `POST /api/auth/google/login` -> backend `/api/v1/auth/google/login`

Other routes:

- `GET /api/public-user` -> backend `/api/v1/public-user`
- `GET /api/profile` -> backend `/api/v1/users/profile` (fallback: `/api/v1/profile`)
- `POST /api/posts` -> backend `/api/v1/posts`
- `POST /api/posts/image` -> backend `/api/v1/posts/image`
- `DELETE /api/posts/image/:uploadId` -> backend `/api/v1/posts/image/:uploadId`
- `GET /api/posts/public` -> backend `/api/v1/posts/public`
- `GET /api/subscriptions/my-payments` -> backend `/api/v1/subscriptions/my-payments`

## Refresh Path Rules (Important)

There are two different refresh paths and they must not be mixed:

- BFF route path (inside Next app): `/api/auth/update`
- Backend path (inside API_URL service): `/api/v1/auth/update`

`bffFetch` performs server-to-backend calls, so its internal refresh request must use backend path.

## Fix Applied (2026-02-17)

Issue:

- Users could be logged out after access token expiration because refresh did not work reliably.
- Root cause: refresh request in `bffFetch` used backend host + BFF path (`${API_URL}/api/auth/update`) instead of backend path.

Changes made in `src/shared/api/server/bffFetch.ts`:

1. Added explicit constants:
   - `REFRESH_BFF_PATH = '/api/auth/update'`
   - `REFRESH_BACKEND_PATH = '/api/v1/auth/update'`
2. Switched internal refresh fetch to `${API_URL}${REFRESH_BACKEND_PATH}`.
3. Updated 401 guard to skip refresh recursion for both path forms.

Expected effect:

- After access token expires, BFF refresh uses correct backend endpoint and session remains authenticated when refresh token is valid.

## Operational Rules For New BFF Endpoints

When adding or editing BFF endpoints:

1. Proxy backend calls through `bffFetch`.
2. Normalize responses via `buildJsonResponse`.
3. Preserve `Set-Cookie` using `forwardSetCookie`.
4. Keep token/cookie logic server-side only.
5. Update this document when route map or auth/cookie behavior changes.
