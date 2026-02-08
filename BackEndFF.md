# BackEndFF (BFF) — описание слоя прокси

Этот документ объясняет, как устроен BFF в проекте: где лежит код, как работают токены/куки и как добавлять новые маршруты.

## Зачем нужен BFF

BFF (Backend‑For‑Frontend) решает несколько задач:

- проксирует запросы к бэкенду;
- хранит `accessToken` только в HttpOnly cookie (не отдаёт его в body ответа);
- форвардит `Set-Cookie` от бэкенда в браузер (включая refresh‑rotation);
- централизованно обрабатывает `401` и делает single‑flight refresh.

## Основные файлы

- `src/shared/api/server/bffFetch.ts` — центральная функция BFF‑прокси.
- `src/shared/api/server/cookies.ts` — извлечение/форвард `Set-Cookie` и нормализация имени access cookie.
- `src/shared/api/server/bffResponse.ts` — нормализация ответов в JSON.
- `app/api/v1/auth/*/route.ts` — App Router маршруты (BFF‑эндпоинты).

## Имя access cookie

- dev: `access_token`
- prod: `__Host-access_token` (Secure + Path=/, без Domain)

Это имя используется при установке access токена и при нормализации входящих `Set-Cookie`.

## Как работает `bffFetch`

Сигнатуры:

- `bffFetch(nextRes, path, options)` — основной вариант (сам ставит cookies в `nextRes`).
- `bffFetch(path, options)` — режим совместимости; возвращает `{ res, setCookie }`.

Шаги внутри:

1. Берёт access токен из cookie и добавляет `Authorization: Bearer <token>`.
2. Делает запрос на `API_URL + path`.
3. Форвардит `Set-Cookie` от бэка (если есть `NextResponse`).
4. Если в JSON есть `{ accessToken }`, кладёт его в HttpOnly cookie и удаляет из body.
5. Если ответ `401` и это не refresh‑роут, делает refresh (single‑flight) и повторяет запрос.

Особенность безопасности:

- `accessToken` никогда не должен уходить в body. `bffFetch` вырезает его из JSON.
- Для `/api/v1/auth/*` JSON парсится даже если бэк не выставил `Content-Type: application/json`.

## Refresh (single‑flight)

Refresh‑путь: `/api/v1/auth/update`.

Поведение:

- При первом `401` создаётся один refresh‑запрос для всех параллельных 401.
- В refresh отправляются только `refreshToken` и access cookie (`access_token` / `__Host-access_token`).
- Все `Set-Cookie` из refresh прокидываются в ответ.
- Если пришёл новый accessToken, он ставится в HttpOnly cookie.

## Нормализация JSON‑ответов (`buildJsonResponse`)

`buildJsonResponse(res)` возвращает корректный JSON‑ответ клиенту:

- если бэк прислал JSON → вернуть его как есть;
- если бэк прислал текст → `{ "message": "<текст>" }`;
- если бэк ничего не прислал:
  - при успехе → `{ "ok": true }`
  - при ошибке → `{ "message": "Request failed" }`

Это удобно для единообразной обработки ошибок на клиенте.

## App Router маршруты (BFF эндпоинты)

Текущие auth‑маршруты в `app/api/v1/auth/*/route.ts` используют:

- `bffFetch` или прямой `fetch` при необходимости;
- `buildJsonResponse` для JSON‑ответа;
- `forwardSetCookie` для прокидывания куки в браузер.

## Как добавлять новые BFF‑маршруты

### Базовый шаблон (универсальный)

1. Создайте API route в `app/api/.../route.ts`.
2. Создайте `cookieCarrier` — временный `NextResponse`, куда `bffFetch` запишет cookies.
3. Вызовите `bffFetch(cookieCarrier, path, options)`.
4. Сформируйте JSON через `buildJsonResponse(res)`.
5. Скопируйте cookies в итоговый ответ через `forwardSetCookie`.

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

### Зачем нужен `cookieCarrier`

`bffFetch` сам ставит HttpOnly cookies и форвардит `Set-Cookie`,
но он не должен напрямую изменять финальный `NextResponse`,
чтобы можно было безопасно модифицировать тело ответа.
Поэтому используется временный `NextResponse` (cookie carrier).

### Аргументы `bffFetch`

- `nextRes`: `NextResponse`, куда ставятся HttpOnly cookies.
- `path`: путь на бэкенде (например `/api/v1/auth/me`).
- `options`: `RequestInit` + `json`:
  - `json`: объект тела; `bffFetch` сам делает `JSON.stringify` и выставляет `Content-Type`.
  - `headers`: дополнительные заголовки.
  - `method`: HTTP метод.

### Когда форвардить cookies

В проекте есть два корректных паттерна:

1. **С `cookieCarrier`** — вы передаёте `NextResponse` в `bffFetch`, а затем копируете
   куки из `cookieCarrier` в финальный ответ через `forwardSetCookie`.

2. **Без `cookieCarrier` (как сейчас в большинстве роутов)** — вы вызываете
   `bffFetch(path, options)` и получаете `{ res, setCookie }`, после чего
   добавляете `setCookie` в итоговый `NextResponse` через `forwardSetCookie`.

Правило по умолчанию: если у вас есть `cookieCarrier` или вы получили `setCookie`
из `bffFetch`, форвардите cookies. Это безопасно и не ломает ответы.

Обязательно для auth‑эндпоинтов:

- login / logout
- refresh (`/api/v1/auth/update`)
- любые auth‑методы, где бэк может вернуть `Set-Cookie`

## Что делает каждый серверный файл

### `src/shared/api/server/bffFetch.ts`

Назначение: центральная функция BFF‑прокси.

- Читает access cookie и добавляет `Authorization: Bearer ...`.
- Делает запрос к `API_URL + path`.
- Форвардит `Set-Cookie` от бэкенда (через `forwardSetCookie`).
- Вытаскивает `accessToken` из JSON и кладёт его в HttpOnly cookie.
- Удаляет `accessToken` из body ответа (возвращает sanitized `Response`).
- При `401` делает single‑flight refresh и повторяет запрос.

### `src/shared/api/server/bffResponse.ts`

Назначение: единый JSON‑ответ BFF.

- Превращает любой ответ в корректный JSON.
- На ошибке гарантирует наличие `message`.
- Корректно обрабатывает пустые ответы (204/205/304).

### `src/shared/api/server/cookies.ts`

Назначение: работа с `Set-Cookie` и нормализация имени access cookie.

- `getSetCookie` — надёжно читает все `Set-Cookie` из `Response`.
- `rewriteAccessCookieForProd` — превращает `access_token` в `__Host-access_token`
  и добавляет обязательные атрибуты для продакшена.
- `forwardSetCookie` — добавляет cookies в `NextResponse`.

## Где смотреть ошибки на клиенте

Snackbar реализован в `src/shared/ui/Alert/Alert.tsx` и вызывается через
`showAlert(text, variant)`. Типовой паттерн:

- прочитать `message` из JSON ответа;
- отобразить `showAlert(message, 'error')`.

## Ключевые параметры окружения

- `API_URL` — базовый URL бэкенда (обязателен, если бэк не на том же хосте).
- `NODE_ENV` — определяет имя cookie (`access_token` vs `__Host-access_token`).

## Краткий чек‑лист

- `accessToken` не попадает в body.
- `refreshToken` остаётся HttpOnly и приходит только через `Set-Cookie`.
- все auth‑ответы нормализованы в JSON.
- single‑flight refresh работает на конкурентных `401`.
