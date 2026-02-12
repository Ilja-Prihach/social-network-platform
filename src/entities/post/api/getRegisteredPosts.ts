import type { Post } from '../model/types';
import { mockPosts } from '../mock/posts';

export async function getRegisteredPosts(): Promise<Post[]> {
  return mockPosts;
}
