import {
  getPublicProfilePostsPageServer,
  getPublicProfileServer,
} from '@/entities/profile/api/profileApi.server';
import type { ProfilePostsPage, PublicProfile } from '@/entities/profile';
import { isApiError } from '@/shared/api/types';
import { notFound } from 'next/navigation';
import { ProfileDetailsPageClient } from './ProfileDetailsPageClient';

type PageParams = {
  id?: string | string[];
};

type ProfileDetailsPageProps = {
  params: Promise<PageParams>;
};

const resolveProfileId = (params: PageParams): number | null => {
  const raw = Array.isArray(params.id) ? params.id[0] : params.id;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export async function ProfileDetailsPage({ params }: ProfileDetailsPageProps) {
  const resolvedParams = (await params) as PageParams;
  const profileId = resolveProfileId(resolvedParams);
  if (!profileId) {
    notFound();
  }

  let profile: PublicProfile;
  let initialPostsPage: ProfilePostsPage;

  try {
    [profile, initialPostsPage] = await Promise.all([
      getPublicProfileServer(profileId),
      getPublicProfilePostsPageServer({ profileId }),
    ]);
  } catch (error) {
    if (isApiError(error) && error.status === 404) {
      notFound();
    }
    throw error;
  }

  return (
    <ProfileDetailsPageClient
      profileId={profileId}
      initialProfile={profile}
      initialPostsPage={initialPostsPage}
    />
  );
}
