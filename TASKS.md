# Tasks

## Now

В компоненте MyProfilePage.tsx нужно выполнить следующею задачу

Авторизованный пользователь открывает свою домашнюю страницу (выбирает в сайтбаре "My profile")

URL содержит id пользователя. Страница профиля пользователя доступна для просмотра всем пользователям без авторизации,
но редактировать профиль (создавать, удалять, изменять посты и другую информацию) могут только авторизованные
пользователи, являющиеся владельцами профиля.

Для этой компоненты так же нужно создать в entities/profile/ а там уже profileApi.ts и model где
будут лежать хуки для взаимодействия с бэком, не забудь так же сделать роут в app/public-user/profile
для взаимодействия с бэком /api/v1/public-user/profile/{profileId}
[Name Description
profileId \* (required)
number
(path)
profileId
Responses
Code Description Links
200
Get public profile information object

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"id": 1,
"userName": "user1",
"aboutMe": "About me",
"avatars": [
{
"url": "https://example.com/image.jpg",
"width": 300,
"height": 300,
"fileSize": 300,
"createdAt": "2026-02-11T11:14:36.393Z"
}
],
"userMetadata": {
"following": 1,
"followers": 1,
"publications": 1
},
"hasPaymentSubscription": true,
"isFollowing": true,
"isFollowedBy": true
}
No links
400
Profile not found

Media type

application/json
Example Value
Schema
{
"statusCode": 400,
"messages": [
{
"message": "User not found",
"field": "string"
}
],
"error": "Bad Request"
}
No links
] не забывай что мы используем BFF

Система отображает публикации пользователя (последние 8 шт постов, от новых публикаций к старым) для этого есть готовая
компонента PostCard.tsx.

Страница содержит: фото пользователя, username, About me, кнопку [ Profile Setting ] и посты, нужно продумать этот момент,
возможно создать отдельные компоненты

Авторизованный пользователь может просмотреть больше своих постов используя скрол

Система подгружает по 8 постов и отображает пользователю

Помните!
При скролле на странице скроллится только блок с контентом, Sidebars остается на месте
Tooltip content.

скрин как должна выглядить страничка
![My profile.png](../../../Users/nlxx/Downloads/Inctagram%20%281%29/WebApp/My%20profile.png)
вопрос, у тебя есть доступ к просмотру этого скрина?

И самое главное придерживайся общей стилистики написания кода в проекте, если возникаю вопросы или спорные моменты то
спрашивай перед тем как писать код

## Later

- [ ] Идеи и отложенные задачи

## Notes

- Пиши кратко и по пунктам.
- Можно добавлять ссылки на файлы, например: `src/app/App.tsx`.
- Задавай уточняющие вопросы. Пока я на них не отвечу и не напишу "go", не приступай к написанию кода.
