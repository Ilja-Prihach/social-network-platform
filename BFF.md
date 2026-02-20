# BFF Overview And Audit

## Purpose

This document describes how the BFF layer in this repository works and records a correctness audit of the current implementation.

Scope:

- `app/api/**` route handlers
- `src/shared/api/server/bffFetch.ts`
- `src/shared/api/server/bffResponse.ts`
- `src/shared/api/server/cookies.ts`

## High-Level Flow

1. Client calls local Next.js API route (`/api/auth/*`, `/api/public-user`).
2. Route handler delegates backend call to `bffFetch(...)`.
3. `bffFetch`:

- reads auth cookie (`access_token` or `__Host-access_token`) from server cookie store
- sets `Authorization: Bearer <token>` when token exists
- sends request to `${API_URL}<backend_path>`
- extracts and forwards `Set-Cookie`
- on `401` (except refresh route) performs single-flight refresh via `/api/auth/update`
- retries original request with refreshed token
- strips `accessToken` from JSON body and writes it to HttpOnly cookie

4. Route returns normalized JSON with `buildJsonResponse(...)` and forwards cookies to browser.

## Core Building Blocks

### `bffFetch` (`src/shared/api/server/bffFetch.ts`)

- Supports two modes:
  - `bffFetch('/path', options)` returns `{ res, setCookie }`
  - `bffFetch(nextResponse, '/path', options)` writes cookies directly to `nextResponse` and returns `Response`
- Automatically injects Authorization from server cookie.
- Handles token refresh with a shared promise (`refreshPromise`) to avoid parallel refresh storms.
- Sanitizes backend JSON response by removing `accessToken` from payload and persisting token in HttpOnly cookie.

### `buildJsonResponse` (`src/shared/api/server/bffResponse.ts`)

- Converts backend `Response` into `NextResponse` JSON.
- Preserves status/statusText.
- Handles no-content statuses (`204`, `205`, `304`) without body.
- Falls back to `{ message }` or `{ ok: true }` when body parsing fails.

### `cookies` helpers (`src/shared/api/server/cookies.ts`)

- `getSetCookie(...)`: reads all `Set-Cookie` headers safely.
- `rewriteAccessCookieForProd(...)`: rewrites access cookie to `__Host-access_token` in production and enforces `Secure` + `Path=/` + no `Domain`.
- `forwardSetCookie(...)`: appends rewritten cookies to `NextResponse`.

## Route Map

Auth proxy routes:

- `POST /api/auth/login` -> `/api/v1/auth/login`
- `POST /api/auth/logout` -> `/api/v1/auth/logout`
- `GET /api/auth/me` -> `/api/v1/auth/me`
- `POST /api/auth/update` -> `/api/v1/auth/update`
- `POST /api/auth/registration` -> `/api/v1/auth/registration`
- `POST /api/auth/registration-email-resending` -> `/api/v1/auth/registration-email-resending`
- `POST /api/auth/registration-confirmation` -> `/api/v1/auth/registration-confirmation`
- `POST /api/auth/password-recovery` -> `/api/v1/auth/password-recovery`
- `POST /api/auth/new-password` -> `/api/v1/auth/new-password`
- `GET /api/auth/github/login` -> redirect to backend OAuth entrypoint
- `POST /api/auth/github/update-tokens` -> `/api/v1/auth/github/update-tokens`
- `POST /api/auth/github/accept` -> sets access token cookie from body token
- `POST /api/auth/google/login` -> `/api/v1/auth/google/login`

Other:

- `GET /api/public-user` -> `/api/v1/public-user`
- `GET /api/users/profile` -> `/api/v1/users/profile`
- `PUT /api/users/profile` -> `/api/v1/users/profile`

## Correctness Audit

## What Is Correct

- BFF isolates auth token operations on server side; client does not handle HttpOnly access cookie directly.
- Cookie forwarding and rewriting strategy is consistent across most auth routes.
- Refresh-on-401 with single-flight guard is implemented and avoids duplicated refresh requests.
- Response normalization is consistent and resilient to malformed backend payloads.
- `logout` clears local access cookie explicitly after backend call.

## Issues Found

- No open critical BFF issues were found during the latest audit after fixes applied on 2026-02-16.

### Resolved During Audit (2026-02-16)

1. Added missing route `POST /api/auth/registration-email-resending`.
2. Removed OAuth payload logging from `app/api/auth/google/login/route.ts`.
3. Added explicit `API_URL` guard in `src/shared/api/server/bffFetch.ts`.

## Operational Rules For New BFF Routes

When adding or editing BFF endpoints:

1. Use `bffFetch` for backend calls.
2. Use `buildJsonResponse` for response shaping.
3. Preserve `Set-Cookie` via `forwardSetCookie`.
4. Keep token/cookie logic server-side only.
5. Add route to this document’s route map.
6. Verify there is a one-to-one mapping between client calls in `src/**` and handlers in `app/api/**`.

## Audit Date

- Audit performed on 2026-02-16.
