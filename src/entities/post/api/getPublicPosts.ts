import { baseApi } from '@/shared/api/baseApi';

type PublicPostImageDto = {
  url: string;
  width: number;
  height: number;
  fileSize: number;
  createdAt: string;
  uploadId: string;
};

export type PublicPostDto = {
  id: number;
  userName: string;
  description: string;
  location: string;
  images: PublicPostImageDto[];
  createdAt: string;
  updatedAt: string;
  ownerId: number;
  avatarOwner: string | null;
  likesCount: number;
  isLiked: boolean;
};

type PublicPostsResponse = {
  totalCount: number;
  pagesCount: number;
  page: number;
  pageSize: number;
  prevCursor: number | null;
  nextCursor: number | null;
  items: PublicPostDto[];
};

export type GetPublicPostsParams = {
  endCursorPostId?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export async function getPublicPosts(params: GetPublicPostsParams = {}): Promise<PublicPostDto[]> {
  const {
    endCursorPostId = 0,
    pageSize = 4,
    sortBy = 'createdAt',
    sortDirection = 'desc',
  } = params;

  const query = new URLSearchParams({
    pageSize: String(pageSize),
    sortBy,
    sortDirection,
    endCursorPostId: String(endCursorPostId),
  });

  const url = `/api/posts/public?${query.toString()}`;
  const response = await baseApi<PublicPostsResponse>(url);

  return response.items;
}
