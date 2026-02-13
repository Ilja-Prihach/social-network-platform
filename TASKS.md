# Tasks

## Done

- Реализована универсальная страница профиля по `/:locale/profile/[id]`.
- Добавлен профильный слой данных: `src/entities/profile/*` (api, hooks, types, exports).
- Добавлены BFF-роуты:
  - `app/api/public-user/profile/[profileId]/route.ts`
  - `app/api/posts/user/[userId]/route.ts`
- Сделан `my-profile` редирект через `me.userId`.
- В шапке профиля отображаются данные из API:
  `userName`, `aboutMe`, counters, avatar из `avatars[]` с fallback.
- Кнопка `Profile Settings` показывается только владельцу профиля.
- Скролл у страницы только в контентном блоке, sidebar фиксированный.
- На странице профиля используется `PostMediaCarousel` (без `PostCard`).
- Посты подключены к реальному endpoint `GET /api/v1/posts/user/{userId}/{endCursorPostId}`
  через BFF и грузятся infinite scroll по `pageSize=8`.
- Временный fallback/mock постов удален.

## Current

- В `ProfileDetailsPage` рендер постов идет напрямую из response полей:
  `images`, `description`, `createdAt`, `userName`, `avatarOwner`.
- Курсор пагинации берется из последнего `items[].id`.

## Next

- [ ] Подтвердить и при необходимости удалить legacy роут:
      `app/api/public-user/profile/[profileId]/posts/route.ts`.
- [ ] Уточнить финальный контракт first-page запроса:
      backend без cursor (`.../user/{userId}`) vs с cursor=0 (`.../user/{userId}/0`).

## Notes

- Перед изменениями формулировать задачу кратко и по пунктам.
- Если есть спорные места по API/UX, сначала уточнение, потом код.
- Для новых задач и контекста использовать `context/profile-status.md`.
