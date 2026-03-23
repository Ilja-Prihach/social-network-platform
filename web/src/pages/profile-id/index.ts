import type { Metadata } from 'next';
import { getPublicProfileServer } from '@/entities/profile/api/profileApi.server';
import { isApiError } from '@/shared/api/types';
import { ProfileDetailsPage } from './ui/ProfileDetailsPage';

type PageParams = {
  id?: string | string[];
};

type ProfileDetailsPageProps = {
  params: Promise<PageParams>;
};

const normalizeId = (params: PageParams): number | null => {
  const raw = Array.isArray(params.id) ? params.id[0] : params.id;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export async function generateMetadata({ params }: ProfileDetailsPageProps): Promise<Metadata> {
  const resolvedParams = (await params) as PageParams;
  const profileId = normalizeId(resolvedParams);
  if (!profileId) {
    return {
      title: 'Profile',
      description: 'Public profile page',
    };
  }

  try {
    const profile = await getPublicProfileServer(profileId);
    const description = profile.aboutMe?.trim() || `Public profile of ${profile.userName}`;

    return {
      title: `${profile.userName} | Profile`,
      description,
      openGraph: {
        title: `${profile.userName} | Profile`,
        description,
      },
    };
  } catch (error) {
    if (isApiError(error) && error.status === 404) {
      return {
        title: 'Profile Not Found',
        description: 'Requested profile does not exist.',
      };
    }

    return {
      title: 'Profile',
      description: 'Public profile page',
    };
  }
}

export default ProfileDetailsPage;
