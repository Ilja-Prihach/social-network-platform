import type { PostViewerPost } from '@/entities/post';
import type { ProfilePostsPage } from '@/entities/profile';

type ProfilePost = ProfilePostsPage['items'][number];

export function mapProfilePostToViewerPost(item: ProfilePost): PostViewerPost {
  return {
    id: item.id,
    createdAt: item.createdAt,
    text: item.text,
    userName: item.userName,
    avatarOwner: item.avatarOwner,
    media: item.media.map((mediaItem) => ({
      id: mediaItem.id,
      type: 'image',
      src: mediaItem.src,
      alt: mediaItem.alt,
    })),
    likesCount: item.likesCount,
    likesAvatars: item.likesAvatars,
    isLiked: item.isLiked,
  };
}
