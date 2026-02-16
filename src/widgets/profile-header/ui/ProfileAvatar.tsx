import Image from 'next/image';
import styles from './ProfileAvatar.module.scss';

type ProfileAvatarProps = {
  avatarUrl: string;
  userName: string;
};

export function ProfileAvatar({ avatarUrl, userName }: ProfileAvatarProps) {
  return (
    <div className={styles.avatar_wrap}>
      <Image src={avatarUrl} alt={userName} width={192} height={192} className={styles.avatar} />
    </div>
  );
}
