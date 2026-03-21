import type { Post, PostMedia } from '@/entities/post';
import type { PublicPostDto } from '@/entities/post';
import type { User } from '@/entities/user';
import type { PostCardVM } from './types';

export function mapPublicPostsToPostCardVM(items: PublicPostDto[]): PostCardVM[] {
  return items.map((item) => {
    const post: Post = {
      id: String(item.id),
      authorId: String(item.ownerId),
      createdAt: item.createdAt,
      text: item.description ?? '',
      media: item.images.map<PostMedia>((image) => ({
        id: image.uploadId,
        type: 'image',
        src: image.url,
      })),
    };

    const author: User = {
      id: String(item.ownerId),
      username: item.userName,
      avatarUrl: item.avatarOwner ?? undefined,
    };

    return {
      post,
      author,
      likesCount: item.likesCount,
      isLiked: item.isLiked,
    };
  });
}
