# Tasks

## Done

- Реализована универсальная страница профиля по `/:locale/profile/[id]`.
- Добавлен профильный слой данных:
  `src/entities/profile/*` (api, model hooks, types, exports).
- Добавлены BFF-роуты:
  `app/api/public-user/profile/[profileId]/route.ts`
  `app/api/public-user/profile/[profileId]/posts/route.ts`.
- Сделан `my-profile` редирект через `me.userId`:
  `src/pages/my-profile/ui/MyProfilePage.tsx`.
- В шапке профиля отображаются данные из API:
  `userName`, `aboutMe`, counters, avatar из `avatars[]` с fallback на mock.
- Кнопка `Profile Settings` показывается только владельцу профиля.
- Скролл у страницы только в контентном блоке, sidebar фиксированный.
- Скрыт визуальный скроллбар контентного блока профиля.

## Current

- Посты сейчас грузятся через `useInfiniteQuery`, но источник временно fallback/mock.
- Сетевой запрос к `/api/v1/public-user/profile/{id}/posts` отключен по умолчанию
  (endpoint на backend сейчас не подтвержден).

## Next

- [ ] Подключить реальный endpoint постов профиля (пагинация по 8).
- [ ] Уточнить и зафиксировать контракт ответа постов.
- [] в @ProfileDetailsPage.tsx я допустил ошибку, мы должны там использовать не
  @Postcard целиком, а только @PostMediaCarousel , возможно это карточка еще не доделана, но модернизировать
  ее не нужно, а только всавить нужны данные из респонса
  /api/v1/posts/user/{userId}/{endCursorPostId} - думаю это потходящий запрос , инфа с бэка
  Get posts by user id

Parameters
Try it out
Name Description
userId \* (required)
number
(path)
userId
endCursorPostId
number
(path)
ID of the last uploaded post. If endCursorPostId not provided, the first set of posts is returned

endCursorPostId
pageSize
number
(query)
page size is number of items that should be returned

pageSize
sortBy
string
(query)
Sort by parameters

sortBy
sortDirection
string
(query)
Sort by desc or asc

Available values : asc, desc

Default value : desc

desc
Responses
Code Description Links
200
Success

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"totalCount": 10,
"pageSize": 10,
"totalUsers": 10,
"items": [
{
"id": 1,
"userName": "Alex",
"description": "description",
"location": "location",
"images": [
{
"url": "https://example.com/image.jpg",
"width": 300,
"height": 300,
"fileSize": 300,
"createdAt": "2026-02-11T11:14:36.393Z",
"uploadId": "string"
}
],
"createdAt": "2026-02-11T11:14:36.767Z",
"updatedAt": "2026-02-11T11:14:36.767Z",
"ownerId": 1,
"avatarOwner": "https://storage.yandexcloud.net/users-inctagram/users/41/avatar/3359612b-cff9-4b6b-8897-fbbd09153d51-images-45x45",
"owner": {
"firstName": "firstName",
"lastName": "lastName"
},
"likesCount": 1,
"isLiked": true,
"avatarWhoLikes": false
}
]
}
No links
401
Unauthorized

Но проверь меня так же и сам, я приложил скрины всего свагера, имею ввиду все методы связанные с постами
скрин в папке codex, название post_methods.jpg , дай оценку моему заданию и не пиши сразу код

- [ ] Удалить временный fallback/mock после подключения реального API.

## Notes

- Перед изменениями формулировать задачу кратко и по пунктам.
- Если есть спорные места по API/UX, сначала уточнение, потом код.
- Для новых задач и контекста использовать `context/profile-status.md`.
