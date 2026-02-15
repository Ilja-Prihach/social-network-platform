import 'server-only';

import type { PublicPostDto } from '@/entities/post';
import { mapPublicPostsToPostCardVM } from '@/widgets/post-card';
import type { PostCardVM } from '@/widgets/post-card';

type PublicPostsResponse = {
  items: PublicPostDto[];
};

type PublicUsersResponse = {
  totalCount: number;
};

type HomePageInitialData = {
  posts: PostCardVM[];
  peopleCount: number | null;
};

const REVALIDATE_SECONDS = 60;
const HOME_POSTS_LIMIT = 4;

const resolveApiUrl = () => process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? '';

const buildPostsUrl = (apiUrl: string) => {
  const query = new URLSearchParams({
    pageSize: String(HOME_POSTS_LIMIT),
    sortBy: 'createdAt',
    sortDirection: 'desc',
  });

  return `${apiUrl}/api/v1/posts/all/0?${query.toString()}`;
};

const buildPeopleCountUrl = (apiUrl: string) => `${apiUrl}/api/v1/public-user`;

const fetchJson = async <T>(url: string): Promise<T | null> => {
  try {
    const response = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
};

export async function getHomePageInitialData(): Promise<HomePageInitialData> {
  const apiUrl = resolveApiUrl();
  if (!apiUrl) {
    return { posts: [], peopleCount: null };
  }

  const [postsResponse, peopleResponse] = await Promise.all([
    fetchJson<PublicPostsResponse>(buildPostsUrl(apiUrl)),
    fetchJson<PublicUsersResponse>(buildPeopleCountUrl(apiUrl)),
  ]);

  const posts = mapPublicPostsToPostCardVM(postsResponse?.items ?? []);
  const peopleCount =
    typeof peopleResponse?.totalCount === 'number' ? peopleResponse.totalCount : null;

  return { posts, peopleCount };
}
