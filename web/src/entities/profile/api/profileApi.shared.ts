import type { ProfilePost, ProfilePostMedia, ProfilePostsPage } from '../model/types';

export const PROFILE_POSTS_PAGE_SIZE = 8;
export const PROFILE_POSTS_DEFAULT_SORT = {
  sortBy: 'createdAt',
  sortDirection: 'desc',
} as const;

export type RawProfilePostsResponse = {
  totalCount?: number;
  pageSize?: number;
  items?: unknown[];
};

type BuildProfilePostsQueryParams = {
  pageSize?: number | string;
  sortBy?: string;
  sortDirection?: string;
  endCursorPostId?: number | string | null;
};

type BuildProfilePostsPathParams = BuildProfilePostsQueryParams & {
  profileId: number | string;
};

const resolveCursor = (value: number | string | null | undefined): string | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (typeof value === 'string' && value.trim()) return value;
  return null;
};

export const buildProfilePostsQuery = ({
  pageSize = PROFILE_POSTS_PAGE_SIZE,
  sortBy = PROFILE_POSTS_DEFAULT_SORT.sortBy,
  sortDirection = PROFILE_POSTS_DEFAULT_SORT.sortDirection,
  endCursorPostId,
}: BuildProfilePostsQueryParams): URLSearchParams => {
  const params = new URLSearchParams({
    pageSize: String(pageSize),
    sortBy,
    sortDirection,
  });

  const cursor = resolveCursor(endCursorPostId);
  if (cursor) {
    params.set('endCursorPostId', cursor);
  }

  return params;
};

export const buildProfilePostsPath = ({
  profileId,
  endCursorPostId,
  sortBy,
  sortDirection,
  pageSize = PROFILE_POSTS_PAGE_SIZE,
}: BuildProfilePostsPathParams) => {
  const basePath = `/api/posts/user/${profileId}`;
  const params = buildProfilePostsQuery({ pageSize, sortBy, sortDirection, endCursorPostId });

  return `${basePath}?${params.toString()}`;
};

export const buildBackendProfilePostsPath = ({
  profileId,
  endCursorPostId,
  sortBy,
  sortDirection,
  pageSize = PROFILE_POSTS_PAGE_SIZE,
}: BuildProfilePostsPathParams) => {
  const basePath = `/api/v1/posts/user/${profileId}`;
  const params = buildProfilePostsQuery({ pageSize, sortBy, sortDirection });
  const cursor = resolveCursor(endCursorPostId);
  return cursor ? `${basePath}/${cursor}?${params.toString()}` : `${basePath}?${params.toString()}`;
};

export const mapProfilePostsPage = (
  data: RawProfilePostsResponse,
  pageSize = PROFILE_POSTS_PAGE_SIZE,
): ProfilePostsPage => {
  const items = Array.isArray(data.items)
    ? data.items
        .map((rawItem) => mapProfilePost(rawItem))
        .filter((item): item is ProfilePost => item !== null)
    : [];

  const nextCursorPostId = getNextCursorPostId(items);

  return {
    items,
    totalCount: typeof data.totalCount === 'number' ? data.totalCount : items.length,
    pageSize: typeof data.pageSize === 'number' ? data.pageSize : pageSize,
    nextCursorPostId,
  };
};

const mapProfilePost = (rawItem: unknown): ProfilePost | null => {
  if (!isRecord(rawItem)) return null;

  const id = toNumber(rawItem.id);
  if (id === null) return null;

  const text =
    typeof rawItem.description === 'string'
      ? rawItem.description
      : typeof rawItem.text === 'string'
        ? rawItem.text
        : '';

  const media = toMediaArray(rawItem.images ?? rawItem.media, id);
  if (!media.length) return null;

  return {
    id: String(id),
    createdAt: typeof rawItem.createdAt === 'string' ? rawItem.createdAt : new Date().toISOString(),
    text,
    media,
    userName: typeof rawItem.userName === 'string' ? rawItem.userName : 'User',
    avatarOwner: typeof rawItem.avatarOwner === 'string' ? rawItem.avatarOwner : undefined,
    likesCount: toNumber(rawItem.likesCount ?? rawItem.likeCount) ?? undefined,
    likesAvatars: toLikesAvatars(rawItem.likesAvatars ?? rawItem.likesUsers ?? rawItem.newestLikes),
    isLiked: toBoolean(rawItem.isLiked ?? rawItem.isLikedByMe ?? rawItem.myLike) ?? undefined,
  };
};

const toMediaArray = (value: unknown, seed: number): ProfilePostMedia[] => {
  if (!Array.isArray(value)) return [];

  const mapped: Array<ProfilePostMedia | null> = value.map((item, index) => {
    if (!isRecord(item)) return null;
    const url =
      typeof item.url === 'string' ? item.url : typeof item.src === 'string' ? item.src : '';
    if (!url) return null;

    return {
      id: String(item.uploadId ?? item.id ?? `${seed}-${index}`),
      type: 'image',
      src: url,
      alt: 'Post media',
    };
  });

  return mapped.filter((item): item is ProfilePostMedia => item !== null);
};

const getNextCursorPostId = (items: ProfilePost[]): number | null => {
  if (!items.length) return null;
  const last = items[items.length - 1];
  const parsed = Number(last.id);
  return Number.isFinite(parsed) ? parsed : null;
};

const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const toBoolean = (value: unknown): boolean | null => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return null;
};

const toLikesAvatars = (value: unknown): string[] | undefined => {
  if (!Array.isArray(value)) return undefined;

  const avatars = value
    .map((item) => {
      if (typeof item === 'string') return item;
      if (!isRecord(item)) return null;

      const avatar =
        typeof item.avatarOwner === 'string'
          ? item.avatarOwner
          : typeof item.avatarUrl === 'string'
            ? item.avatarUrl
            : typeof item.url === 'string'
              ? item.url
              : null;

      return avatar;
    })
    .filter((item): item is string => Boolean(item));

  return avatars.length ? avatars : undefined;
};
