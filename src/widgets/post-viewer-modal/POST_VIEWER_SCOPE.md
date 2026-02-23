# Post Viewer Scope

Файлы, задействованные в отображении и открытии поста:

1. Модалка просмотра поста
   - `src/widgets/post-viewer-modal/ui/PostViewerModal.tsx`
   - `src/widgets/post-viewer-modal/ui/PostViewerModal.module.scss`
   - `src/widgets/post-viewer-modal/index.ts`
2. Общая логика открытия (feature)
   - `src/features/post/open-post-viewer/model/usePostViewer.ts`
   - `src/features/post/open-post-viewer/index.ts`
3. Страницы, где открывается просмотр
   - `src/pages/home/ui/HomePage.tsx`
   - `src/pages/profile-id/ui/ProfileDetailsPageClient.tsx`
4. Мапперы данных поста в формат viewer
   - `src/pages/home/model/mapPostCardVmToViewerPost.ts`
   - `src/pages/profile-id/model/mapProfilePostToViewerPost.ts`
5. Карточка поста (источник клика в ленте)
   - `src/widgets/post-card/ui/PostCard.tsx`
   - `src/widgets/post-card/ui/PostCard.module.scss`
6. Типы, на которые опирается viewer
   - `src/entities/post/model/types.ts` (`PostViewerPost`)
   - `src/entities/post/index.ts` (экспорт типа)
   - `src/entities/profile/model/types.ts` (данные проф.поста с лайками)
   - `src/entities/profile/api/profileApi.shared.ts` (маппинг лайков из API)
