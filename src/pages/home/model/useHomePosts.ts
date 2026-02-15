'use client';

import { useQuery } from '@tanstack/react-query';
import { getPublicPosts } from '@/entities/post';
import type { ApiError } from '@/shared/api/types';
import { mapPublicPostsToPostCardVM } from '@/widgets/post-card';
import type { PostCardVM } from '@/widgets/post-card';

export function useHomePosts() {
  return useQuery<PostCardVM[], ApiError>({
    queryKey: ['home-posts'],
    queryFn: async () => {
      const data = await getPublicPosts({ pageSize: 4 });
      return mapPublicPostsToPostCardVM(data);
    },
    staleTime: 60 * 1000,
  });
}
