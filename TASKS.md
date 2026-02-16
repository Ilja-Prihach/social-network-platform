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
- Декомпозиция шапки профиля выполнена:
  `ProfileHeader` собран из `ProfileAvatar` + `ProfileMeta` (`src/widgets/profile-header/*`).
- Скролл у страницы только в контентном блоке, sidebar фиксированный.
- На странице профиля используется `PostMediaCarousel` (без `PostCard`).
- Посты подключены к реальному endpoint `GET /api/v1/posts/user/{userId}/{endCursorPostId}`
  через BFF и грузятся infinite scroll по `pageSize=8`.
- Временный fallback/mock постов удален.

## Current

- В `ProfileDetailsPage` рендер постов идет напрямую из response полей:
  `images`, `description`, `createdAt`, `userName`, `avatarOwner`.
- Курсор пагинации берется из последнего `items[].id`.
- После декомпозиции шапки профиля `npm run build` проходит успешно.

## Next

- [x] Зафиксирован финальный контракт first-page запроса для постов пользователя.
  - подтверждено: `GET /api/v1/posts/user/{userId}` без cursor возвращает первую страницу;
  - `app/api/posts/user/[userId]/route.ts`: fallback на `/0` удален, оставлен один путь first-page;
  - `context/profile-status.md` обновлен;
  - live-check: `userId=26`, status `200`, `totalCount=24`, `items=8` (при `pageSize=8`).

## Notes

- Перед изменениями формулировать задачу кратко и по пунктам.
- Если есть спорные места по API/UX, сначала уточнение, потом код.
- Для новых задач и контекста использовать `context/profile-status.md`.
- Не приступать к написанию кода, пока пользователь явно не напишет `go`.
