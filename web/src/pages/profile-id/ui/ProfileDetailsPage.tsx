import {
  getPublicProfilePostsPageServer,
  getPublicProfileServer,
} from '@/entities/profile/api/profileApi.server';
import type { ProfilePostsPage, PublicProfile } from '@/entities/profile';
import { isApiError } from '@/shared/api/types';
import { notFound } from 'next/navigation';
import { ProfileDetailsPageClient } from './ProfileDetailsPageClient';
import { getPublicPostServer } from '@/entities/post/api/postApi.server';

type PageParams = {
  id?: string | string[];
};

type ProfileDetailsPageProps = {
  params: Promise<PageParams>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const resolveProfileId = (params: PageParams): number | null => {
  const raw = Array.isArray(params.id) ? params.id[0] : params.id;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const resolvePostId = (
  searchParams?: Record<string, string | string[] | undefined>,
): number | null => {
  const raw = searchParams?.postId;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export async function ProfileDetailsPage({ params, searchParams }: ProfileDetailsPageProps) {
  const resolvedParams = (await params) as PageParams;
  const profileId = resolveProfileId(resolvedParams);
  if (!profileId) {
    notFound();
  }

  const resolvedSearchParams = (await searchParams) as
    | Record<string, string | string[] | undefined>
    | undefined;

  const postId = resolvePostId(resolvedSearchParams);

  let profile: PublicProfile;
  let initialPostsPage: ProfilePostsPage;
  let initialPost = null;

  try {
    const postPromise = postId ? getPublicPostServer(postId) : Promise.resolve(null);
    [profile, initialPostsPage, initialPost] = await Promise.all([
      getPublicProfileServer(profileId),
      getPublicProfilePostsPageServer({ profileId }),
      postPromise,
    ]);
  } catch (error) {
    if (isApiError(error) && (error.status === 404 || error.status === 400)) {
      notFound();
    }
    throw error;
  }

  return (
    <ProfileDetailsPageClient
      profileId={profileId}
      initialProfile={profile}
      initialPostsPage={initialPostsPage}
      initialPost={initialPost}
    />
  );
}
