'use client';

import { useEffect, useState } from 'react';
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
  const [relativeTime, setRelativeTime] = useState('');

  useEffect(() => {
    setRelativeTime(formatRelativeTime(createdAt));
  }, [createdAt]);

  return (
    <div className={s.root}>
      <div className={s.top}>
        <div className={s.avatar}>
          <Image src={avatarSrc} alt={user.username} width={36} height={36} priority={false} />
        </div>
        <div className={s.username}>{user.username}</div>
      </div>

      <div className={s.time}>{relativeTime}</div>
    </div>
  );
}
