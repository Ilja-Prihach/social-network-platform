import type { PublicProfile } from '@/entities/profile';
import { Button } from '@/shared/ui/Button';
import { useDictionary, useLocale } from 'next-intlayer';
import profileHeaderContent from '../profile-header.content';
import styles from './ProfileMeta.module.scss';

type ProfileMetaProps = {
  profile: PublicProfile;
  isOwner: boolean;
};

export function ProfileMeta({ profile, isOwner }: ProfileMetaProps) {
  const content = useDictionary(profileHeaderContent);
  const { locale } = useLocale();
  const formatCount = (value: number) => new Intl.NumberFormat(locale).format(value);

  return (
    <div className={styles.profile_meta}>
      <div className={styles.profile_row}>
        <h1 className={styles.title}>{profile.userName}</h1>
        {isOwner && (
          <Button
            href="/my-profile/settings"
            variant="secondary"
            className={styles.settings_button}
          >
            {content.profileSettings.value}
          </Button>
        )}
      </div>

      <ul className={styles.stats}>
        <li className={styles.stat_item}>
          <strong>{formatCount(profile.userMetadata.following)}</strong>
          <span>{content.following.value}</span>
        </li>
        <li className={styles.stat_item}>
          <strong>{formatCount(profile.userMetadata.followers)}</strong>
          <span>{content.followers.value}</span>
        </li>
        <li className={styles.stat_item}>
          <strong>{formatCount(profile.userMetadata.publications)}</strong>
          <span>{content.publications.value}</span>
        </li>
      </ul>

      {profile.aboutMe && <p className={styles.about}>{profile.aboutMe}</p>}
    </div>
  );
}
