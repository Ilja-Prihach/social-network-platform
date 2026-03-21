import 'server-only';

import { serverApi } from '@/shared/api/server/serverApi';
import type { PostViewerPost } from '../model/types';

const resolvePostCandidate = (value: unknown): unknown => {
  if (!isRecord(value)) return value;
  if (isRecord(value.post)) return value.post;
  if (isRecord(value.item)) return value.item;
  return value;
};

export async function getPublicPostServer(postId: number): Promise<PostViewerPost | null> {
  const data = await serverApi<unknown>(`/api/v1/posts/${postId}`, { withAuth: false });
  return mapPostViewerPost(data);
}

const mapPostViewerPost = (raw: unknown): PostViewerPost | null => {
  const candidate = resolvePostCandidate(raw);
  if (!isRecord(candidate)) return null;

  const id = toNumber(candidate.id);
  if (id === null) return null;

  const text =
    typeof candidate.description === 'string'
      ? candidate.description
      : typeof candidate.text === 'string'
        ? candidate.text
        : '';

  const media = toMediaArray(candidate.images ?? candidate.media, id);

  return {
    id: String(id),
    createdAt:
      typeof candidate.createdAt === 'string' ? candidate.createdAt : new Date().toISOString(),
    text,
    userName: typeof candidate.userName === 'string' ? candidate.userName : 'User',
    avatarOwner: typeof candidate.avatarOwner === 'string' ? candidate.avatarOwner : undefined,
    media,
    likesCount: toNumber(candidate.likesCount ?? candidate.likeCount) ?? undefined,
    likesAvatars: toLikesAvatars(
      candidate.likesAvatars ?? candidate.likesUsers ?? candidate.newestLikes,
    ),
    isLiked: toBoolean(candidate.isLiked ?? candidate.isLikedByMe ?? candidate.myLike) ?? undefined,
  };
};

const toMediaArray = (value: unknown, seed: number) => {
  if (!Array.isArray(value)) return [];

  const mapped = value
    .map((item, index) => {
      if (!isRecord(item)) return null;

      const url =
        typeof item.url === 'string' ? item.url : typeof item.src === 'string' ? item.src : '';

      if (!url) return null;

      return {
        id: String(item.uploadId ?? item.id ?? `${seed}-${index}`),
        type: 'image' as const,
        src: url,
        alt: 'Post media',
      };
    })
    .filter(
      (item): item is { id: string; type: 'image'; src: string; alt: string } => item !== null,
    );

  return mapped;
};

const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
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

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};
