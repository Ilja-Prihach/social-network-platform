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
  - backend targets:
    - first page: `GET /api/v1/posts/user/{userId}`
    - next page: `GET /api/v1/posts/user/{userId}/{endCursorPostId}`
  - query params: `pageSize`, `sortBy`, `sortDirection`
- Posts data layer:
  - `useProfilePostsInfiniteQuery` uses cursor (`endCursorPostId`) and `pageSize=8`
  - next cursor = last `items[].id`
- Profile UI:
  - fixed sidebar + content-only scroll
  - hidden visual scrollbar in content container
  - owner-only `Profile Settings` button
  - avatar selection: prefer `192x192`, fallback to first, then mock
  - profile header decomposition:
    - `src/widgets/profile-header/ui/ProfileHeader.tsx`
    - `src/widgets/profile-header/ui/ProfileAvatar.tsx`
    - `src/widgets/profile-header/ui/ProfileMeta.tsx`
  - figma alignment for profile header (node `304:3572`):
    - avatar size `204x204`
    - gap between avatar/meta `38px`
    - title `20px` with `1.8` line-height
    - stats typography `14px` with `var(--light-100-color)`
    - about width `730px`
  - post grid uses `PostMediaCarousel` + lightweight post meta (not `PostCard`)

## Active Contract (Posts)

- Response fields consumed:
  - `totalCount`, `pageSize`, `items[]`
  - per item: `id`, `userName`, `description`, `images[]`, `createdAt`, `avatarOwner`
- `images[]` mapped to carousel media (`url` -> `src`).

## Open Questions

- Legacy route status:
  - `app/api/public-user/profile/[profileId]/posts/route.ts` removed

## Resume Block

- Current branch: `fill-me`
- Last commit: `fill-me`
- Local status check:
  - `git status --short`
  - `npm run dev`
  - `npm run build`
- What works now:
  - profile header is loaded from `/api/public-user/profile/{id}`
  - profile header UI is decomposed to `ProfileAvatar + ProfileMeta`
  - profile posts are requested via BFF `app/api/posts/user/[userId]/route.ts`
  - posts UI uses `PostMediaCarousel` in `ProfileDetailsPage`
- Known risks:
  - environment-dependent build issues (fonts/network/sandbox)
- First step on resume:
  - validate first-page request in browser network (`GET /api/v1/posts/user/{userId}`)
  - if backend contract changed, update `app/api/posts/user/[userId]/route.ts`
  - if response shape changed, update mapping in `src/entities/profile/api/profileApi.ts`
- Evidence to bring into next chat:
  - first request URL + status from Network for profile posts
  - response body snippet for first page (`totalCount`, `items[0].id`)
  - whether endpoint works without cursor or only with `/0`
- Start prompt for next chat:
  - `Read TASKS.md and context/profile-status.md, then continue from Next section without refactoring unrelated files.`
