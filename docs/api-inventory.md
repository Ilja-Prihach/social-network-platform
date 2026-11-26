# Инвентаризация существующих интеграций

Снимок исходного кода на 2026-11-26. Это контракт потребителей, а не подтверждённая спецификация старого сервера: допустимые значения, лимиты и все ответы потребуется определить при проектировании. Каждый путь ниже соответствует файлу `web/app/api/<путь>/route.ts`; квадратные скобки обозначают динамический сегмент Next.js.

## Маршруты web

| Методы | Локальный маршрут | Внешний путь из обработчика |
| --- | --- | --- |
| POST | `/api/auth/github/accept` | `Локальная обработка или построитель пути — см. примечания` |
| GET | `/api/auth/github/login` | `/api/v1/auth/github/login` |
| POST | `/api/auth/github/update-tokens` | `/api/v1/auth/github/update-tokens` |
| POST | `/api/auth/google/login` | `/api/v1/auth/google/login` |
| POST | `/api/auth/login` | `/api/v1/auth/login` |
| POST | `/api/auth/logout` | `/api/v1/auth/logout` |
| GET | `/api/auth/me` | `/api/v1/auth/me` |
| POST | `/api/auth/new-password` | `/api/v1/auth/new-password` |
| POST | `/api/auth/password-recovery` | `/api/v1/auth/password-recovery` |
| POST | `/api/auth/registration` | `/api/v1/auth/registration` |
| POST | `/api/auth/registration-confirmation` | `/api/v1/auth/registration-confirmation` |
| POST | `/api/auth/registration-email-resending` | `/api/v1/auth/registration-email-resending` |
| DELETE | `/api/auth/sessions/[deviceId]` | `/api/v1/sessions/${deviceId}` |
| GET | `/api/auth/sessions` | `/api/v1/sessions` |
| DELETE | `/api/auth/sessions/terminate-all` | `/api/v1/sessions/terminate-all` |
| GET | `/api/auth/socket-token` | `/api/v1/auth/me` |
| POST | `/api/auth/update` | `/api/v1/auth/update` |
| PUT | `/api/notifications/mark-as-read` | `/api/v1/notifications/mark-as-read` |
| GET | `/api/notifications` | `Локальная обработка или построитель пути — см. примечания` |
| DELETE, PUT | `/api/posts/[postId]` | `/api/v1/posts/${encodeURIComponent(postId)}` |
| DELETE | `/api/posts/image/[uploadId]` | `/api/v1/posts/image/${uploadId}` |
| POST | `/api/posts/image` | `/api/v1/posts/image` |
| GET | `/api/posts/public` | `/api/v1/posts/all/${Number.isFinite(endCursorPostId) ? endCursorPostId : 0}?${query.toString()}` |
| POST | `/api/posts` | `/api/v1/posts` |
| POST | `/api/posts/translate` | `Локальная обработка или построитель пути — см. примечания` |
| GET | `/api/posts/user/[userId]` | `Локальная обработка или построитель пути — см. примечания` |
| GET | `/api/public-user/profile/[profileId]` | `/api/v1/public-user/profile/${profileId}` |
| GET | `/api/public-user` | `/api/v1/public-user` |
| GET | `/api/subscriptions/my-payments` | `/api/v1/subscriptions/my-payments?${query}` |
| POST, DELETE | `/api/users/profile/avatar` | `/api/v1/users/profile/avatar` |
| GET, PUT | `/api/users/profile` | `/api/v1/users/profile` |

Примечания к построителям и локальной логике:

- Посты пользователя: `/api/v1/posts/user/{profileId}` или `/api/v1/posts/user/{profileId}/{cursor}`; построитель в `web/src/entities/profile/api/profileApi.shared.ts`.
- Уведомления: `/api/v1/notifications` или `/api/v1/notifications/{cursor}`; построитель в `web/src/entities/notification/api/notificationApi.shared.ts`.
- Публичная лента реально использует `/api/v1/posts/all/{cursor}`. Старое описание в BFF.md перечисляет другой путь; при реализации ориентироваться на обработчик и согласованную спецификацию.
- `github/accept` принимает access token и устанавливает cookie локально; `socket-token` проверяет текущего пользователя и возвращает токен клиенту. Эти мосты нужно отдельно пересмотреть при проектировании авторизации.
- `posts/translate` принимает `text` и `targetLanguage`, возвращает `translatedText`; вызывает Intlayer AI и резервный Google endpoint непосредственно из Next.js. Это исключение из общего потока BFF.

## Данные и семантика потребителей

| Область | Наблюдаемый формат | Источник |
| --- | --- | --- |
| Регистрация | `userName`, `email`, `password`, опциональный `baseUrl`; BFF дополняет origin | `web/src/entities/auth/api/authApi.ts`, маршрут регистрации |
| Вход и текущий пользователь | email/password; me: userId, userName, email, isBlocked | `packages/auth-core/src/authApi.ts`, `web/src/entities/user/api/me.ts` |
| Подтверждение и сброс | confirmationCode; email/recaptcha/locale; newPassword/recoveryCode | `web/src/entities/auth/api/authApi.ts` |
| Сессии | current и others; deviceId, IP, время активности и сведения об устройстве | тот же authApi |
| Профиль | имя пользователя, ФИО, страна/регион/город, дата рождения, aboutMe, массив avatars | `web/src/entities/profile/model/types.ts` |
| Публичный профиль | avatars, userMetadata (following/followers/publications), признаки подписки и отношений | тот же types.ts |
| Изображения и пост | multipart files → images с uploadId; создание: description и childrenMetadata с uploadId; изменение: description | `web/src/entities/post/api/postMutations.ts` |
| Публичная лента | items с ownerId, images, description, likesCount/isLiked; курсор и сортировка | `web/src/entities/post/api/publicPosts.shared.ts` |
| Уведомления | items с id/message/isRead/notifyAt/createdAt, notReadCount, cursor; чтение: ids | `web/src/entities/notification/model/types.ts` и API |
| История оплат | items, totalCount/pagesCount/page/pageSize; subscriptionId, периоды, price, тип подписки и провайдера | `web/src/entities/payment/model/types.ts` |

Особенности для будущей спецификации: ID встречаются как строки и числа; ошибки имеют несколько форматов; пагинация смешивает страницы и курсоры. Нельзя переносить терпимые клиентские нормализаторы в строгую серверную схему без решения. Размеры файлов, порядок изображений, временные загрузки и очистка сирот, срок жизни кодов и токенов, денежная единица и статусы подписок пока не определены.

## Админка и realtime

Админка обращается к `/api/v1/graphql` через Apollo: `loginAdmin(email,password) → logged`, `getUsers` с поиском, сортировкой, statusFilter и страницами; `banUser(userId,banReason)`, `unbanUser(userId)`, `removeUser(userId) → boolean`. Источники: `admin/src/features/sign-in/model/loginAdmin.ts`, `admin/src/features/users-list/model/{getUsersList,userActions}.ts`. Сейчас запросы после входа используют Basic Auth, а credentials хранятся в sessionStorage. Это наследуемый механизм, не принятое решение для новой системы.

Socket.IO в `web/src/entities/notification/realtime/socketAdapter.ts` подключается к старому хосту, передаёт accessToken в query и слушает событие `notifications`. Событие инвалидирует REST-кеш; предусмотрены polling и BroadcastChannel. Формат защищённого подключения и доставка после переподключения требуют нового решения.

Поиск мест в редакторе обращается к Nominatim (`useLocationSuggestions.ts`). OAuth, почта, перевод и платёжные провайдеры требуют отдельного описания конфигурации, ошибок и доступности; наличие UI не подтверждает работающую интеграцию.
