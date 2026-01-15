import Image from 'next/image';
import type { User } from '../model/types';
import { formatRelativeTime } from '@/shared/lib/date/formatRelativeTime';
import s from './UserBadge.module.scss';

type Props = {
  user: User;
  createdAt: string;
};

export function UserBadge({ user, createdAt }: Props) {
  const avatarSrc = user.avatarUrl || '/mock/Avatar1.jpg';

  return (
    <div className={s.root}>
      <div className={s.avatar}>
        <Image src={avatarSrc} alt={user.username} width={44} height={44} priority={false} />
      </div>

      <div className={s.meta}>
        <div className={s.username}>{user.username}</div>
        <div className={s.time}>{formatRelativeTime(createdAt)}</div>
      </div>
    </div>
  );
}
