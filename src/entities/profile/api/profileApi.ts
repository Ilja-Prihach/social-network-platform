import { baseApi } from '@/shared/api/baseApi';
import type {
  GetPublicProfilePostsParams,
  ProfilePost,
  ProfilePostMedia,
  ProfilePostsPage,
  PublicProfile,
} from '../model/types';

export const PROFILE_POSTS_PAGE_SIZE = 8;
const ENABLE_PROFILE_POSTS_API = false;

const MOCK_PROFILE_POSTS_TOTAL = 24;
const MOCK_IMAGE_POOL = [
  '/mock/Post1.jpg',
  '/mock/Post2.jpg',
  '/mock/Post3.jpg',
  '/mock/Post4.jpg',
  '/mock/Post5.jpg',
];

export function getPublicProfile(profileId: number) {
  return baseApi<PublicProfile>(`/api/public-user/profile/${profileId}`);
}

export async function getPublicProfilePostsPage({
  profileId,
  pageNumber,
  pageSize = PROFILE_POSTS_PAGE_SIZE,
}: GetPublicProfilePostsParams): Promise<ProfilePostsPage> {
  if (!ENABLE_PROFILE_POSTS_API) {
    return buildMockProfilePostsPage(pageNumber, pageSize);
  }

  try {
    const data = await baseApi<unknown>(
      `/api/public-user/profile/${profileId}/posts?pageSize=${pageSize}&pageNumber=${pageNumber}`,
    );
    const normalized = normalizePostsResponse(data, pageNumber, pageSize);

    if (normalized.items.length > 0) {
      return normalized;
    }
  } catch {
    // Endpoint is not finalized yet; keep UI working with predictable fallback data.
  }

  return buildMockProfilePostsPage(pageNumber, pageSize);
}

const normalizePostsResponse = (
  data: unknown,
  pageNumber: number,
  pageSize: number,
): ProfilePostsPage => {
  const rawItems = pickItems(data);
  const totalCount = pickTotalCount(data) ?? rawItems.length;
  const pagesCount = pickPagesCount(data);
  const hasMore = pagesCount
    ? pageNumber < pagesCount
    : pageNumber * pageSize < Math.max(totalCount, rawItems.length);

  const items = rawItems
    .map((rawItem, index) => mapProfilePost(rawItem, pageNumber, index))
    .filter((item): item is ProfilePost => item !== null);

  return {
    items,
    pageNumber,
    pageSize,
    totalCount,
    hasMore,
  };
};

const mapProfilePost = (
  rawItem: unknown,
  pageNumber: number,
  index: number,
): ProfilePost | null => {
  if (!isRecord(rawItem)) return null;

  const media = toMediaArray(rawItem.images ?? rawItem.media, index);

  return {
    id: String(rawItem.id ?? rawItem.postId ?? `${pageNumber}-${index}`),
    createdAt:
      typeof rawItem.createdAt === 'string'
        ? rawItem.createdAt
        : new Date(Date.now() - index * 60_000).toISOString(),
    text:
      typeof rawItem.description === 'string'
        ? rawItem.description
        : typeof rawItem.text === 'string'
          ? rawItem.text
          : '',
    media: media.length ? media : buildFallbackMedia(index),
  };
};

const toMediaArray = (value: unknown, seed: number): ProfilePostMedia[] => {
  if (!Array.isArray(value)) return [];

  const media: Array<ProfilePostMedia | null> = value.map((item, index) => {
    if (!isRecord(item)) return null;

    const url = item.url ?? item.src;
    if (typeof url !== 'string' || !url) return null;

    // PostMediaCarousel uses next/image, so we keep a local-safe source here.
    const src = url.startsWith('/')
      ? url
      : MOCK_IMAGE_POOL[(seed + index) % MOCK_IMAGE_POOL.length];

    return {
      id: String(item.id ?? `${seed}-${index}`),
      type: 'image' as const,
      src,
      alt: 'Post media',
    };
  });

  return media.filter((item): item is ProfilePostMedia => item !== null);
};

const buildFallbackMedia = (seed: number): ProfilePostMedia[] => [
  {
    id: `fallback-${seed}`,
    type: 'image',
    src: MOCK_IMAGE_POOL[seed % MOCK_IMAGE_POOL.length],
    alt: 'Post media',
  },
];

const buildMockProfilePostsPage = (pageNumber: number, pageSize: number): ProfilePostsPage => {
  const start = (pageNumber - 1) * pageSize;
  const end = Math.min(start + pageSize, MOCK_PROFILE_POSTS_TOTAL);

  const items: ProfilePost[] = Array.from({ length: Math.max(0, end - start) }, (_, localIndex) => {
    const absoluteIndex = start + localIndex;

    return {
      id: `profile-mock-${absoluteIndex + 1}`,
      createdAt: new Date(Date.now() - absoluteIndex * 60 * 60 * 1000).toISOString(),
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      media: buildFallbackMedia(absoluteIndex),
    };
  });

  return {
    items,
    pageNumber,
    pageSize,
    totalCount: MOCK_PROFILE_POSTS_TOTAL,
    hasMore: end < MOCK_PROFILE_POSTS_TOTAL,
  };
};

const pickItems = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value;
  if (!isRecord(value)) return [];

  const candidates = [value.items, value.posts, value.publications];
  const found = candidates.find(Array.isArray);

  return Array.isArray(found) ? found : [];
};

const pickTotalCount = (value: unknown): number | null => {
  if (!isRecord(value)) return null;
  return toNumber(value.totalCount) ?? toNumber(value.totalItems) ?? toNumber(value.count);
};

const pickPagesCount = (value: unknown): number | null => {
  if (!isRecord(value)) return null;
  return toNumber(value.pagesCount) ?? toNumber(value.pageCount);
};

const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  return null;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};
