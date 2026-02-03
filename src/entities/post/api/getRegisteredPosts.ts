import type { Post } from '../model/types';
import { mockPosts } from '../mock/posts';

export async function getRegisteredPosts(): Promise<Post[]> {
  // позже: заменить на fetch(...) и вернуть данные с бэкенда
  return mockPosts;
}
