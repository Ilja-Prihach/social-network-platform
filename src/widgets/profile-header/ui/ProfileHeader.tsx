import Image from 'next/image';
import type { PublicProfile } from '@/entities/profile';
import { Button } from '@/shared/ui/Button';
import styles from './ProfileHeader.module.scss';

const formatCount = (value: number) => new Intl.NumberFormat('en-US').format(value);

type ProfileHeaderProps = {
  profile: PublicProfile;
  avatarUrl: string;
  isOwner: boolean;
};

export function ProfileHeader({ profile, avatarUrl, isOwner }: ProfileHeaderProps) {
  return (
    <div className={styles.profile_header}>
      <div className={styles.avatar_wrap}>
        <Image
          src={avatarUrl}
          alt={profile.userName}
          width={192}
          height={192}
          className={styles.avatar}
        />
      </div>

      <div className={styles.profile_meta}>
        <div className={styles.profile_row}>
          <h1 className={styles.title}>{profile.userName}</h1>
          {isOwner && (
            <Button href="/settings" variant="secondary" className={styles.settings_button}>
              Profile Settings
            </Button>
          )}
        </div>

        <ul className={styles.stats}>
          <li className={styles.stat_item}>
            <strong>{formatCount(profile.userMetadata.following)}</strong>
            <span>Following</span>
          </li>
          <li className={styles.stat_item}>
            <strong>{formatCount(profile.userMetadata.followers)}</strong>
            <span>Followers</span>
          </li>
          <li className={styles.stat_item}>
            <strong>{formatCount(profile.userMetadata.publications)}</strong>
            <span>Publications</span>
          </li>
        </ul>

        {profile.aboutMe && <p className={styles.about}>{profile.aboutMe}</p>}
      </div>
    </div>
  );
}
