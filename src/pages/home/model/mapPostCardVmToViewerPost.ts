import type { PostViewerPost } from '@/entities/post';
import type { PostCardVM } from '@/widgets/post-card';

export function mapPostCardVmToViewerPost(item: PostCardVM): PostViewerPost {
  return {
    id: item.post.id,
    createdAt: item.post.createdAt,
    text: item.post.text,
    userName: item.author.username,
    avatarOwner: item.author.avatarUrl,
    media: item.post.media.map((mediaItem) => ({
      id: mediaItem.id,
      type: 'image',
      src: mediaItem.src,
      alt: mediaItem.alt,
    })),
  };
}

export function getPostCardVmAuthorId(item: PostCardVM): number | undefined {
  const parsed = Number(item.author.id);
  return Number.isNaN(parsed) ? undefined : parsed;
}
