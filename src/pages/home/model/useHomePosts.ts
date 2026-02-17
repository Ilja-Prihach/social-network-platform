'use client';

import { useQuery } from '@tanstack/react-query';
import { getPublicPosts } from '@/entities/post';
import type { ApiError } from '@/shared/api/types';
import { mapPublicPostsToPostCardVM } from '@/widgets/post-card';
import type { PostCardVM } from '@/widgets/post-card';

export function useHomePosts(initialPosts: PostCardVM[] = []) {
  const initialSnapshotKey = initialPosts.map((item) => item.post.id).join(',');

  return useQuery<PostCardVM[], ApiError>({
    queryKey: ['home-posts', initialSnapshotKey],
    queryFn: async () => {
      const data = await getPublicPosts({ pageSize: 4 });
      return mapPublicPostsToPostCardVM(data);
    },
    initialData: initialPosts.length ? initialPosts : undefined,
    staleTime: 60 * 1000,
    refetchOnMount: true,
    refetchInterval: 60 * 1000,
    refetchIntervalInBackground: true,
  });
}
