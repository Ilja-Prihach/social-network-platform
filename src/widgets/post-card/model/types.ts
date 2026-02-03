import type { Post } from '@/entities/post';
import type { User } from '@/entities/user';

/**
 * View-model for PostCard widget.
 * Combines Post entity + User entity (author).
 */
export type PostCardVM = {
  post: Post;
  author: User;
};
