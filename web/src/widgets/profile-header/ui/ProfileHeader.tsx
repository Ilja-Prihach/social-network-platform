import type { PublicProfile } from '@/entities/profile';
import { ProfileAvatar } from './ProfileAvatar';
import { ProfileMeta } from './ProfileMeta';
import styles from './ProfileHeader.module.scss';

type ProfileHeaderProps = {
  profile: PublicProfile;
  avatarUrl: string;
  isOwner: boolean;
};

export function ProfileHeader({ profile, avatarUrl, isOwner }: ProfileHeaderProps) {
  return (
    <div className={styles.profile_header}>
      <ProfileAvatar avatarUrl={avatarUrl} userName={profile.userName} />
      <ProfileMeta profile={profile} isOwner={isOwner} />
    </div>
  );
}
