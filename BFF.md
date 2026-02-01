# BFF (Backend‑For‑Frontend) — overview

## Purpose

This app uses a small BFF layer (Next.js App Router API routes) to:

- proxy calls to the backend (`API_URL`),
- keep tokens on the server (HttpOnly cookies),
- handle refresh rotation (forward `Set-Cookie`),
- normalize cookie names for prod (`__Host-access_token`).

The BFF is intentionally thin: it forwards backend responses, but never exposes `accessToken` to the browser response body.

## Main pieces

- `src/shared/api/server/bffFetch.ts` — core server fetch with auth, refresh and cookie handling.
- `src/shared/api/server/cookies.ts` — helpers for extracting/forwarding `Set-Cookie` and normalizing access cookie for prod.
- `app/api/v1/auth/*/route.ts` — App Router endpoints that proxy auth-related backend routes.

## Environments and cookie naming

- dev: `access_token`
- prod: `__Host-access_token` (always `Secure` and `Path=/`, no `Domain`)

The name mapping is applied in two places:

- when BFF sets the access cookie (`bffFetch` and login/refresh routes)
- when `Set-Cookie` is forwarded (`rewriteAccessCookieForProd`)

## How requests flow

### 1) Standard request via `bffFetch`

1. Read access cookie from `next/headers`.
2. If exists, attach `Authorization: Bearer <token>`.
3. Forward request to backend.
4. Forward all `Set-Cookie` from backend to the client response (refresh rotation).
5. If response JSON contains `{ accessToken }`, store it as HttpOnly cookie and strip it from the client response body.

### 2) Single‑flight refresh on 401

When backend responds `401` (except refresh path itself):

1. Start refresh flow once per concurrent 401s.
2. Call `POST /api/v1/auth/update` with only refresh+access cookies.
3. Forward refresh `Set-Cookie` to the client response.
4. If refresh returns a new `{ accessToken }`, store it as HttpOnly cookie.
5. Retry original request with new access token.

### 3) Login / update routes

- `app/api/v1/auth/login`:
  - calls backend `/login`, reads JSON, sets access cookie, returns `{ ok: true }` on success.
  - forwards backend `Set-Cookie` (refresh cookie).
- `app/api/v1/auth/update`:
  - proxies refresh endpoint, sets access cookie, forwards refresh cookie.
  - note: currently returns backend JSON body as-is.

## Files and responsibilities

- `src/shared/api/server/bffFetch.ts`
  - reads access token from server cookies
  - attaches `Authorization` header
  - **never** exposes access token in body to the browser
  - forwards `Set-Cookie` headers from backend
  - performs single‑flight refresh and retries

- `src/shared/api/server/cookies.ts`
  - `getSetCookie`: robust `Set-Cookie` extraction
  - `forwardSetCookie`: forwards + normalizes access cookie name in prod
  - `rewriteAccessCookieForProd`: enforces `__Host-` semantics in prod

- `app/api/v1/auth/*/route.ts`
  - thin API routes, usually
    - call `bffFetch` or backend
    - forward `Set-Cookie`
    - return body with same status

## Security considerations

### ✅ What is already covered

- Access token never stored in JS-readable location (HttpOnly cookie only).
- Access token stripped from JSON responses handled by `bffFetch`.
- Refresh token stays in `Set-Cookie` (HttpOnly) and is forwarded from backend.
- `__Host-` semantics enforced in prod.

### ⚠️ What to watch

- `app/api/v1/auth/update/route.ts` currently returns backend JSON verbatim; if backend includes `{ accessToken }`, it will be exposed to the client. For strict no‑token‑in‑body policy, align this route with `bffFetch` behavior (sanitize JSON response or call `bffFetch(nextRes, ...)`).
- `API_URL` defaults to `''`. If backend is on a different host, `API_URL` must be set to avoid hitting the same origin.
- Ensure backend always sends refresh cookie as `HttpOnly`, `Secure` in prod, and ideally `SameSite=Lax` or `Strict`.

## Extending the BFF

- Prefer calling `bffFetch(nextRes, path, options)` in new routes.
- When proxying responses, always forward `Set-Cookie` and avoid leaking `accessToken` in JSON.
- For non‑JSON endpoints, `bffFetch` does not modify the body.
- For JSON responses, access token is removed by clone+sanitize.

## Known deviations / TODO

- Align `app/api/v1/auth/update/route.ts` with `bffFetch` sanitization.
- Consider a guard for missing `API_URL` to avoid accidental same‑origin calls.
