'use client';

import { useQuery } from '@tanstack/react-query';
import { getPublicPosts } from '@/entities/post';
import type { ApiError } from '@/shared/api/types';
import { mapPublicPostsToPostCardVM } from '@/widgets/post-card';
import type { PostCardVM } from '@/widgets/post-card';
import { useMe } from '@/features/auth/model/useMe';

export function useHomePosts(initialPosts: PostCardVM[] = []) {
  const { data: me } = useMe();
  const initialSnapshotKey = initialPosts.map((item) => item.post.id).join(',');
  const meId = me?.userId ? String(me.userId) : null;

  return useQuery<PostCardVM[], ApiError>({
    queryKey: ['home-posts', initialSnapshotKey, meId],
    queryFn: async () => {
      const data = await getPublicPosts({ pageSize: meId ? 20 : 4 });
      const cards = mapPublicPostsToPostCardVM(data);

      if (!meId) {
        return cards;
      }

      return [...cards].sort((left, right) => {
        const leftOwn = left.author.id === meId;
        const rightOwn = right.author.id === meId;
        if (leftOwn === rightOwn) return 0;
        return leftOwn ? -1 : 1;
      });
    },
    initialData: initialPosts.length ? initialPosts : undefined,
    staleTime: 60 * 1000,
    refetchOnMount: true,
    refetchInterval: 60 * 1000,
    refetchIntervalInBackground: true,
  });
}
