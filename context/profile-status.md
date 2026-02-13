# Profile Status

## Scope

- Universal profile page:
  `app/[locale]/profile/[id]/page.tsx` -> `src/pages/profile-id/ui/ProfileDetailsPage.tsx`.
- My profile entrypoint:
  `app/[locale]/my-profile/page.tsx` -> `src/pages/my-profile/ui/MyProfilePage.tsx`.

## Implemented

- Public profile via BFF:
  - `app/api/public-user/profile/[profileId]/route.ts`
  - frontend call: `getPublicProfile(profileId)` in `src/entities/profile/api/profileApi.ts`
- User posts via BFF (real API):
  - `app/api/posts/user/[userId]/route.ts`
  - backend target: `GET /api/v1/posts/user/{userId}/{endCursorPostId}`
  - query params: `pageSize`, `sortBy`, `sortDirection`
- Posts data layer:
  - `useProfilePostsInfiniteQuery` uses cursor (`endCursorPostId`) and `pageSize=8`
  - next cursor = last `items[].id`
- Profile UI:
  - fixed sidebar + content-only scroll
  - hidden visual scrollbar in content container
  - owner-only `Profile Settings` button
  - avatar selection: prefer `192x192`, fallback to first, then mock
  - post grid uses `PostMediaCarousel` + lightweight post meta (not `PostCard`)

## Active Contract (Posts)

- Response fields consumed:
  - `totalCount`, `pageSize`, `items[]`
  - per item: `id`, `userName`, `description`, `images[]`, `createdAt`, `avatarOwner`
- `images[]` mapped to carousel media (`url` -> `src`).

## Open Questions

- Confirm first-page rule in backend:
  - `.../posts/user/{userId}` or `.../posts/user/{userId}/0`
- Decide whether to keep or remove legacy route:
  `app/api/public-user/profile/[profileId]/posts/route.ts`
