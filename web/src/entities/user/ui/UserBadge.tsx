'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { User } from '../model/types';
import { formatRelativeTime } from '@/shared/lib/date/formatRelativeTime';
import s from './UserBadge.module.scss';
import Link from 'next/link';

type Props = {
  user: User;
  createdAt: string;
  profileHref?: string;
};

export function UserBadge({ user, createdAt, profileHref }: Props) {
  const avatarSrc = user.avatarUrl || '/mock/Avatar1.jpg';
  const [relativeTime, setRelativeTime] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setRelativeTime(formatRelativeTime(createdAt));
    }, 0);

    return () => window.clearTimeout(timer);
  }, [createdAt]);

  return (
    <div className={s.root}>
      <div className={s.top}>
        <div className={s.avatar}>
          <Image src={avatarSrc} alt={user.username} width={36} height={36} priority={false} />
        </div>
        {profileHref ? (
          <Link className={s.username} href={profileHref}>
            {user.username}
          </Link>
        ) : (
          <div className={s.username}>{user.username}</div>
        )}
      </div>

      <div className={s.time}>{relativeTime}</div>
    </div>
  );
}
