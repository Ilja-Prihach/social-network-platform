import type { Post } from '@/entities/post';
import type { User } from '@/entities/user';
import type { PostCardVM } from './types';

/**
 * Builds PostCard view-models by joining posts with users by authorId.
 */
export function buildPostCards(posts: Post[], users: User[]): PostCardVM[] {
  const usersById = new Map(users.map((u) => [u.id, u]));

  return posts
    .map((post) => {
      const author = usersById.get(post.authorId);
      if (!author) return null;
      return { post, author };
    })
    .filter((x): x is PostCardVM => x !== null);
}
