import { PUBLIC_POSTS_DEFAULT_PAGE_SIZE } from '@/shared/config/pagination';

export const PUBLIC_POSTS_DEFAULT_SORT_BY = 'createdAt';
export const PUBLIC_POSTS_DEFAULT_SORT_DIRECTION = 'desc' as const;

export type PublicPostImageDto = {
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

export type PublicPostsPageDto = {
  totalCount?: number;
  pagesCount?: number;
  page?: number;
  pageSize?: number;
  prevCursor?: number | null;
  nextCursor?: number | null;
  items?: PublicPostDto[];
};

export type GetPublicPostsParams = {
  endCursorPostId?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export const buildPublicPostsQuery = ({
  pageSize = PUBLIC_POSTS_DEFAULT_PAGE_SIZE,
  sortBy = PUBLIC_POSTS_DEFAULT_SORT_BY,
  sortDirection = PUBLIC_POSTS_DEFAULT_SORT_DIRECTION,
}: Omit<GetPublicPostsParams, 'endCursorPostId'>): URLSearchParams => {
  return new URLSearchParams({
    pageSize: String(pageSize),
    sortBy,
    sortDirection,
  });
};

export const buildPublicPostsPath = ({
  endCursorPostId = 0,
  pageSize,
  sortBy,
  sortDirection,
}: GetPublicPostsParams = {}) => {
  const query = buildPublicPostsQuery({ pageSize, sortBy, sortDirection });
  query.set('endCursorPostId', String(endCursorPostId));
  return `/api/posts/public?${query.toString()}`;
};

export const buildBackendPublicPostsPath = ({
  endCursorPostId = 0,
  pageSize,
  sortBy,
  sortDirection,
}: GetPublicPostsParams = {}) => {
  const query = buildPublicPostsQuery({ pageSize, sortBy, sortDirection });
  return `/api/v1/posts/all/${endCursorPostId}?${query.toString()}`;
};

export const normalizeCursorPageItems = (
  rawItems: PublicPostDto[] | undefined,
  cursor: number | null,
  pageSize: number,
): PublicPostDto[] => {
  const items = Array.isArray(rawItems) ? rawItems : [];

  let normalized = items;
  if (typeof cursor === 'number' && normalized[0]?.id === cursor) {
    normalized = normalized.slice(1);
  }

  if (normalized.length > pageSize) {
    normalized = normalized.slice(0, pageSize);
  }

  return normalized;
};

export const resolveNextCursor = (
  items: PublicPostDto[],
  providedCursor: number | null | undefined,
  requestedPageSize: number,
  currentCursor?: number | null,
): number | null => {
  if (typeof providedCursor === 'number') {
    if (typeof currentCursor === 'number' && providedCursor === currentCursor) {
      return null;
    }
    return providedCursor;
  }

  if (items.length < requestedPageSize) {
    return null;
  }

  const lastId = items[items.length - 1]?.id;
  if (typeof lastId !== 'number' || !Number.isFinite(lastId)) {
    return null;
  }

  if (typeof currentCursor === 'number' && lastId === currentCursor) {
    return null;
  }

  return lastId;
};
