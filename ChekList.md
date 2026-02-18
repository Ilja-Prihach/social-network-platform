# CheckList: Profile Flow Audit

Временный файл по тому, что связано с:

- `src/pages/profile/ui/ProfilePage.tsx`
- `src/pages/profile-id/ui/ProfileDetailsPage.tsx`

## 1) App Router entrypoints -> pages

- [x] `app/[locale]/profile/page.tsx`
  - реэкспортит `@/pages/profile`
- [x] `src/pages/profile/index.ts`
  - metadata + default export `ProfilePage`
- [x] `src/pages/profile/ui/ProfilePage.tsx`
  - `useMe()` -> редирект:
    - если есть `me.userId`: `router.replace('/profile/{userId}')`
    - иначе: `router.replace('/sign-in')`
- [x] `src/pages/profile/ui/ProfilePage.module.scss`

- [x] `app/[locale]/profile/[id]/page.tsx`
  - реэкспортит `@/pages/profile-id`
- [x] `src/pages/profile-id/index.ts`
  - metadata + default export `ProfileDetailsPage`
- [x] `src/pages/profile-id/ui/ProfileDetailsPage.tsx`
- [x] `src/pages/profile-id/ui/ProfileDetailsPage.module.scss`

## 2) Связи ProfilePage.tsx

- [x] `src/pages/profile/ui/ProfilePage.tsx`
  - импортирует `useMe` из `src/features/auth/model/useMe.ts`
  - использует `next/navigation` (`useRouter`) для redirect-логики

## 3) Связи ProfileDetailsPage.tsx (главная цепочка)

- [x] `src/pages/profile-id/ui/ProfileDetailsPage.tsx`
  - берет `id` из `useParams()`
  - валидирует `profileId`
  - `useMe()` для определения владельца (`isOwner`)
  - `usePublicProfileQuery(profileId)` для шапки профиля
  - `useProfilePostsInfiniteQuery(profileId)` для постов (infinite)
  - `Sidebar` из `src/widgets/sidebar/ui/Sidebar/Sidebar.tsx`
  - `ProfileHeader` из `src/widgets/profile-header/index.ts`
  - `PostMediaCarousel` из `src/entities/post/ui/PostMediaCarousel.tsx`
  - локальный `pickProfileAvatar` + fallback `'/mock/Avatar1.jpg'`
  - scroll listener + `fetchNextPage()` при приближении к низу

## 4) Декомпозиция ProfileHeader (что сделали)

- [x] `src/widgets/profile-header/index.ts`
  - публичный экспорт только `ProfileHeader`
- [x] `src/widgets/profile-header/ui/ProfileHeader.tsx`
  - композиция: `ProfileAvatar + ProfileMeta`
- [x] `src/widgets/profile-header/ui/ProfileAvatar.tsx`
  - рендерит `next/image` аватара
- [x] `src/widgets/profile-header/ui/ProfileMeta.tsx`
  - username, кнопка `Profile Settings`, stats, about
  - использует `Button` из `src/shared/ui/Button/Button.tsx`
- [x] стили:
  - `src/widgets/profile-header/ui/ProfileHeader.module.scss`
  - `src/widgets/profile-header/ui/ProfileAvatar.module.scss`
  - `src/widgets/profile-header/ui/ProfileMeta.module.scss`

## 5) Data layer профиля (entities/profile)

- [x] `src/entities/profile/index.ts`
  - экспорт API, hooks, types
- [x] `src/entities/profile/model/types.ts`
  - `PublicProfile`
  - `ProfileAvatar`
  - `ProfilePostMedia`
  - `ProfilePost`
  - `ProfilePostsPage`
  - `GetPublicProfilePostsParams`
- [x] `src/entities/profile/model/usePublicProfileQuery.ts`
  - React Query `useQuery` для профиля
- [x] `src/entities/profile/model/useProfilePostsInfiniteQuery.ts`
  - React Query `useInfiniteQuery` для постов
  - `getNextPageParam` через `nextCursorPostId` и `totalCount`
- [x] `src/entities/profile/api/profileApi.ts`
  - `getPublicProfile(profileId)` -> `/api/public-user/profile/{id}`
  - `getPublicProfilePostsPage(...)` -> `/api/posts/user/{id}?pageSize=...&sortBy=createdAt&sortDirection=desc&endCursorPostId=...`
  - маппинг raw response в `ProfilePost[]`
  - курсор = `id` последнего поста
  - `PROFILE_POSTS_PAGE_SIZE = 8`

## 6) Auth/me цепочка (используется обеими страницами)

- [x] `src/features/auth/model/useMe.ts`
  - React Query на ключе `['me']`
  - queryFn: `getMe`
- [x] `src/entities/user/api/me.ts`
  - `getMe()` -> `baseApi('/api/auth/me')`
  - тип `MeResponse`
- [x] `app/api/auth/me/route.ts`
  - BFF proxy на backend `/api/v1/auth/me`

## 7) BFF роуты, связанные с ProfileDetailsPage

- [x] `app/api/public-user/profile/[profileId]/route.ts`
  - proxy на backend `/api/v1/public-user/profile/{profileId}`
- [x] `app/api/posts/user/[userId]/route.ts`
  - first page: `/api/v1/posts/user/{userId}`
  - next page: `/api/v1/posts/user/{userId}/{endCursorPostId}`
  - query params: `pageSize`, `sortBy`, `sortDirection`
  - fallback на `/0` удален (оставлен один first-page путь без cursor)

## 8) Shared API инфраструктура (через нее идет BFF)

- [x] `src/shared/api/baseApi.ts`
  - клиентский fetch wrapper + JSON parse + throw `ApiError`
- [x] `src/shared/api/types.ts`
  - `ApiError` тип
- [x] `src/shared/api/server/bffFetch.ts`
  - серверный fetch в backend, cookie forwarding, refresh flow
- [x] `src/shared/api/server/bffResponse.ts`
  - normalize JSON response
- [x] `src/shared/api/server/cookies.ts`
  - forwarding/rewriting set-cookie

## 9) Доп. UI зависимости ProfileDetailsPage

- [x] `src/widgets/sidebar/ui/Sidebar/Sidebar.tsx`
  - sidebar навигация + logout
- [x] `src/widgets/sidebar/sidebar.content.ts`
  - i18n словарь пунктов sidebar
- [x] `src/entities/post/index.ts`
  - экспорт `PostMediaCarousel`
- [x] `src/entities/post/ui/PostMediaCarousel.tsx`
  - carousel для image/video
- [x] `src/entities/post/model/types.ts`
  - `PostMedia` type (используется carousel)

## 10) Что конкретно меняли в рамках этих экранов

- [x] Зафиксирован контракт first page для постов: без cursor
- [x] Удален fallback `/0` из `app/api/posts/user/[userId]/route.ts`
- [x] Декомпозирован header профиля:
  - `ProfileHeader` -> `ProfileAvatar + ProfileMeta`
- [x] Сверка ProfileHeader с Figma (node `304:3572`) и подгонка ключевых параметров
- [x] Исправлены stylelint ошибки в `ProfileMeta.module.scss`

## 11) Быстрый маршрут данных (коротко)

- [x] `ProfilePage.tsx`
  - `useMe` -> `/api/auth/me` -> `app/api/auth/me/route.ts` -> `/api/v1/auth/me`

- [x] `ProfileDetailsPage.tsx`
  - `usePublicProfileQuery` -> `/api/public-user/profile/{id}` -> `app/api/public-user/profile/[profileId]/route.ts` -> `/api/v1/public-user/profile/{id}`
  - `useProfilePostsInfiniteQuery` -> `/api/posts/user/{id}?...&endCursorPostId=...` -> `app/api/posts/user/[userId]/route.ts` -> `/api/v1/posts/user/{id}` или `/api/v1/posts/user/{id}/{cursor}`
