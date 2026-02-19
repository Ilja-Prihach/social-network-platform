# Profile Posts Query Refactor

## What changed

- Added a single source of truth in `src/entities/profile/api/profileApi.shared.ts`:
  - `PROFILE_POSTS_DEFAULT_SORT`
  - `buildProfilePostsQuery(...)`
  - `buildBackendProfilePostsPath(...)`
- Updated `src/entities/profile/api/profileApi.server.ts` to use `buildBackendProfilePostsPath(...)` instead of local URL/query assembly.
- Updated `app/api/posts/user/[userId]/route.ts` to reuse shared defaults and `buildBackendProfilePostsPath(...)`.

## Why

- Remove duplicated rules for `pageSize`, `sortBy`, `sortDirection`, and cursor handling.
- Reduce risk of future drift between client/server/route behavior.
- Keep cursor-to-backend-path mapping in one place.

## Notes

- Client API (`src/entities/profile/api/profileApi.client.ts`) already used shared path building and did not require behavioral changes.
