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

- [ ] Зафиксировать финальный контракт first-page запроса для постов пользователя.
      Цель:
      убрать неоднозначность первого запроса и оставить один стабильный путь.
      Проверить:
  - работает ли `GET /api/v1/posts/user/{userId}` без cursor;
  - или backend требует `GET /api/v1/posts/user/{userId}/0`.
    Что собрать для решения:
  - скрин/лог из Network первого запроса на профиль (Request URL + Status + Response);
  - при возможности ответ backend-команды по swagger/контракту;
  - пример `items[0].id` из первой страницы (для cursor-перехода).
    Критерий готовности:
  - в `app/api/posts/user/[userId]/route.ts` остается один подтвержденный first-page путь;
  - fallback-логика для first page удалена или оставлена осознанно с комментарием;
  - `context/profile-status.md` обновлен.

## Notes

- Перед изменениями формулировать задачу кратко и по пунктам.
- Если есть спорные места по API/UX, сначала уточнение, потом код.
- Для новых задач и контекста использовать `context/profile-status.md`.
- Не приступать к написанию кода, пока пользователь явно не напишет `go`.
