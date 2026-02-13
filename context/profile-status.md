# Profile Status

## Scope

- Universal profile page: `app/[locale]/profile/[id]/page.tsx` -> `src/pages/profile-id/ui/ProfileDetailsPage.tsx`.
- My profile entrypoint: `app/[locale]/my-profile/page.tsx` -> `src/pages/my-profile/ui/MyProfilePage.tsx`.

## Implemented

- Public profile fetch via BFF:
  - `app/api/public-user/profile/[profileId]/route.ts`
  - frontend call: `getPublicProfile(profileId)` in `src/entities/profile/api/profileApi.ts`
- Profile domain layer:
  - `src/entities/profile/model/types.ts`
  - `src/entities/profile/model/usePublicProfileQuery.ts`
  - `src/entities/profile/model/useProfilePostsInfiniteQuery.ts`
  - `src/entities/profile/index.ts`
- UI behavior:
  - fixed sidebar + scroll only in content block
  - `Profile Settings` visible only for owner (`me.userId === profileId`)
  - avatar priority: `avatars[].width === 192`, fallback to first avatar, else `/mock/Avatar1.jpg`
  - hidden visual scrollbar for profile content area

## Temporary Decisions

- Posts endpoint is not confirmed.
- `ENABLE_PROFILE_POSTS_API = false` in `src/entities/profile/api/profileApi.ts`.
- Posts are currently provided by fallback/mock pages (24 total, 8 per load).
- Infinite loading is active via TanStack `useInfiniteQuery` + manual scroll threshold trigger.

## Open API Contract (Needed)

- Real posts endpoint path for profile publications.
- Response schema for items and pagination fields (`items`, `totalCount`, `pagesCount` etc.).
- Media field format for posts (`images`/`media`, url shapes, text/description key).
