# Server/Client Data Pattern

## Goal

Use this pattern when a page needs SEO-friendly HTML and still has client interactivity.

## When to Apply

- Page content should be indexed by search engines.
- First screen data can be fetched on server.
- Client behavior is still required (`useEffect`, infinite scroll, local state, browser APIs).

## File Layout

Example for entity/page `profile-id`:

- `src/pages/profile-id/ui/ProfileDetailsPage.tsx`
  - server component (route-level data load + notFound handling)
- `src/pages/profile-id/ui/ProfileDetailsPageClient.tsx`
  - client island (interactive UI only)
- `src/pages/profile-id/index.ts`
  - `generateMetadata` + default export
- `src/entities/profile/api/profileApi.client.ts`
  - client requests via `baseApi('/api/...')`
- `src/entities/profile/api/profileApi.server.ts`
  - server requests via `serverApi('/api/v1/...')`
- `src/entities/profile/api/profileApi.shared.ts`
  - shared mappers/constants used by both sides

## Data Flow

1. Server component validates route params.
2. Server component fetches critical data for first paint.
3. Server component passes `initial*` props to client island.
4. Client island hydrates and continues interactive loading.

## Metadata Flow

1. In route-level `index.ts`, implement `generateMetadata`.
2. Reuse server API to fetch minimal metadata source.
3. Return fallback metadata on errors.

## Rules

- Do not import server-only modules into client files.
- Keep browser-specific hooks/components inside `*.Client.tsx` files.
- Keep shared mapping in `*.shared.ts` to avoid duplication.
- Keep BFF route handlers unchanged unless API contract changes.

## Minimal Checklist For New Page

1. Create server page shell (`Page.tsx`).
2. Create client island (`PageClient.tsx`).
3. Add `*.client.ts` and `*.server.ts` API split if missing.
4. Move mappers/constants to `*.shared.ts`.
5. Add `generateMetadata`.
6. Validate with `npm run build`.
