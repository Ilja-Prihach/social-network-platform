# BackEndFF (BFF) — описание реализации

Этот файл — точка входа для понимания BFF‑слоя в проекте. Здесь собраны основные файлы, потоки, правила работы с токенами и примеры использования.

## Зачем здесь BFF

BFF (Backend‑For‑Frontend) нужен, чтобы:

- проксировать запросы к бэкенду,
- хр анить `accessToken` **только** в HttpOnly cookie (неотдавать его в тело ответа),
- прокидывать `Set‑Cookie` от бэка в браузер (refresh‑rotation),
- централизованно обрабатывать `401` и делать single‑flight refresh.

## Основные файлы

- `src/shared/api/server/bffFetch.ts` — ядро BFF‑логики
- `src/shared/api/server/cookies.ts` — извлечение/форвард `Set‑Cookie` и нормализация имени access cookie
- `src/shared/api/server/bffResponse.ts` — нормализация ответа в JSON
- `app/api/v1/auth/*/route.ts` — App Router маршруты (BFF‑эндпоинты)

## Имя cookie

- dev: `access_token`
- prod: `__Host-access_token` (Secure + Path=/, без Domain)

Это имя используется при установке access токена и при нормализации входящих `Set‑Cookie`.

## bffFetch — как работает

Сигнатура:

- `bffFetch(nextRes, path, options)` — основной вариант (сам ставит cookies в `nextRes`)
- `bffFetch(path, options)` — совместимость для мест, где нет `NextResponse`

Основные шаги внутри:

1. Берёт access токен из cookie.
2. Добавляет `Authorization: Bearer <token>`.
3. Делает запрос к `API_URL + path`.
4. Форвардит все `Set‑Cookie` от бэка.
5. Если в JSON есть `{ accessToken }` — кладёт его в HttpOnly cookie **и удаляет из тела ответа**.
6. Если ответ 401 и это не refresh — делает single‑flight refresh и повторяет запрос.

## Refresh (single‑flight)

Путь refresh: `/api/v1/auth/update`.

- При 401 (кроме refresh) создаётся один refresh‑запрос для всех параллельных 401.
- В refresh отправляются только cookies `refreshToken` и `access_token/__Host-access_token`.
- Все `Set‑Cookie` из refresh прокидываются в ответ.
- Если пришёл новый accessToken — он ставится в HttpOnly cookie.

## Защита от утечек токена

- `bffFetch` вырезает `accessToken` из JSON‑ответа через `res.clone().json()`.
- Дополнительно, даже если backend не выставил `Content‑Type: application/json`, на `/api/v1/auth/*` bffFetch всё равно пытается парсить JSON и удалять `accessToken`.

## Нормализация JSON‑ответов

Через `buildJsonResponse(res)`:

- если бэк прислал JSON → возвращается JSON как есть;
- если бэк прислал текст → возвращается `{ "message": "<текст>" }`;
- если бэк ничего не прислал:
  - при успехе → `{ "ok": true }`
  - при ошибке → `{ "message": "Request failed" }`

Это удобно для отображения ошибок на клиенте.

## App Router маршруты (BFF эндпоинты)

Сейчас есть:

- `app/api/v1/auth/login` — login, ставит access cookie, на успех отдаёт `{ ok: true }`
- `app/api/v1/auth/update` — refresh
- `app/api/v1/auth/me` — получить пользователя
- `app/api/v1/auth/registration`
- `app/api/v1/auth/registration-confirmation`
- `app/api/v1/auth/password-recovery`
- `app/api/v1/auth/logout`

Все они:

- используют `bffFetch` или прямой fetch + cookie
- возвращают JSON через `buildJsonResponse`
- форвардят `Set‑Cookie` в браузер

## Как пользоваться BFF в новых маршрутах

### Базовый шаблон (универсальный)

1. Создать API route в `app/api/.../route.ts`.
2. Создать `cookieCarrier` — временный `NextResponse`, в который `bffFetch` сможет записать cookies.
3. Вызвать `bffFetch(cookieCarrier, path, options)`.
4. Сформировать ответ через `buildJsonResponse(res)`.
5. Прокинуть cookies в ответ клиенту через `forwardSetCookie(nextResponse, cookieCarrier)`.

Пример:

```ts
import { NextResponse } from 'next/server';
import { bffFetch } from '@/shared/api/server/bffFetch';
import { forwardSetCookie } from '@/shared/api/server/cookies';
import { buildJsonResponse } from '@/shared/api/server/bffResponse';

export async function GET() {
  const cookieCarrier = new NextResponse();
  const res = await bffFetch(cookieCarrier, '/api/v1/example', { method: 'GET' });

  const nextResponse = await buildJsonResponse(res);
  forwardSetCookie(nextResponse, cookieCarrier);

  return nextResponse;
}
```

### Почему нужен `cookieCarrier`

`bffFetch` сам ставит `HttpOnly` cookies (access token) и форвардит `Set‑Cookie` от бэкенда.\n
Но он не должен напрямую трогать финальный `NextResponse`, чтобы можно было безопасно\n
перехватывать/модифицировать body. Поэтому используется «временный» `NextResponse` —\n
`cookieCarrier`, куда складываются cookies, а потом они копируются в итоговый ответ.

### Аргументы `bffFetch`

Сигнатуры:

- `bffFetch(nextRes, path, options)` — основной режим, где `nextRes` получает cookies.
- `bffFetch(path, options)` — режим совместимости, если `NextResponse` недоступен.

Аргументы:

- `nextRes`: `NextResponse` — сюда bffFetch ставит HttpOnly access cookie.
- `path`: строка, путь на бэкенде (например `/api/v1/auth/me`).
- `options`: `RequestInit` + `json`:
  - `json`: объект тела; bffFetch сам сделает `JSON.stringify` и выставит `Content-Type`.
  - `headers`: дополнительные заголовки.
  - `method`: HTTP метод.

### Когда нужно форвардить cookies, а когда нет

**Правило по умолчанию:** всегда форвардить cookies, если используете `cookieCarrier`.\n
Это безопасно и универсально.

#### Обязательно (auth и refresh):

- `/api/v1/auth/login` — приходит refresh cookie + access cookie
- `/api/v1/auth/update` — refresh rotation, приходит новый refresh cookie
- любые auth‑методы, где бэкенд может вернуть `Set‑Cookie`

#### Можно не форвардить:

- для чисто публичных read‑эндпоинтов (например `/posts`, `/public-feed`), где бэкенд\n
  точно не отдаёт `Set‑Cookie`.\n
  Однако для единообразия проще всегда прокидывать cookies — это не ломает ответы.

### Когда нужен `buildJsonResponse`

Используйте всегда для BFF‑роутов, чтобы:\n

- гарантировать JSON‑ответ клиенту;\n
- иметь `message` в ошибках (удобно для snackbar);\n
- избежать «пустых» или невалидных ответов.

### Важно по безопасности

- `accessToken` никогда не должен уходить в body ответа.\n
  `bffFetch` удаляет его из JSON (через `res.clone().json()`), особенно на auth‑путях.\n
- refresh cookie должен приходить только через `Set‑Cookie` (HttpOnly).

## Что делает каждый серверный файл

### `src/shared/api/server/bffFetch.ts`

Назначение: центральная функция BFF‑прокси.

- Читает access cookie и добавляет `Authorization: Bearer ...`
- Форвардит `Set‑Cookie` от бэка
- Ставит `accessToken` в HttpOnly cookie
- Удаляет `accessToken` из JSON‑ответа
- Делает single‑flight refresh и повторяет запрос

### `src/shared/api/server/bffResponse.ts`

Назначение: единый JSON‑ответ BFF.

- Всегда возвращает корректный JSON
- Если бэк прислал текст → `{ message: "<text>" }`
- Если бэк не прислал ничего → `{ message: "Request failed" }`
- Удобно для snackbar и统一ного UI

### `src/shared/api/server/cookies.ts`

Назначение: работа с `Set‑Cookie` и нормализация имени access cookie.

- `getSetCookie` — надёжно читает все `Set‑Cookie` из Response
- `forwardSetCookie` — добавляет cookies в NextResponse
- `rewriteAccessCookieForProd` — превращает `access_token` в `__Host-access_token` с корректными атрибутами

## Где смотреть ошибки на клиенте

Snackbar реализован в `src/shared/ui/Alert/Alert.tsx` и вызывается через `showAlert(text, variant)`.
Типовой паттерн:

- прочитать `message` из JSON ответа
- отобразить в `showAlert(message, 'error')`

## Ключевые параметры окружения

- `API_URL` — базовый URL бэкенда (обязателен, если бэк не на том же хосте)
- `NODE_ENV` — определяет имя cookie (`access_token` vs `__Host-access_token`)

## Краткий чек‑лист

- accessToken не попадает в body
- refreshToken остаётся HttpOnly и приходит только из `Set‑Cookie`
- все auth‑ответы нормализованы в JSON
- single‑flight refresh работает на конкурентных 401
