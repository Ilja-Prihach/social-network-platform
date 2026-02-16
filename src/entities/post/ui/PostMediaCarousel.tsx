'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import type { PostMedia } from '../model/types';
import { Icon } from '@/shared/ui/Icon';
import s from './PostMediaCarousel.module.scss';

type Props = {
  media: PostMedia[];
};

export function PostMediaCarousel({ media }: Props) {
  const items = useMemo(() => media ?? [], [media]);
  const [index, setIndex] = useState(0);

  const hasMany = items.length > 1;
  const safeIndex = clamp(index, 0, Math.max(0, items.length - 1));
  const current = items[safeIndex];

  const goPrev = () => setIndex((i) => (i <= 0 ? items.length - 1 : i - 1));
  const goNext = () => setIndex((i) => (i >= items.length - 1 ? 0 : i + 1));

  if (!current) {
    return null;
  }

  return (
    <div className={s.root}>
      <div className={s.viewport}>
        {current.type === 'image' ? (
          <Image
            src={current.src}
            alt={current.alt || 'Post media'}
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            className={s.media}
            priority={false}
          />
        ) : (
          <video className={s.media} controls poster={current.poster}>
            <source src={current.src} />
          </video>
        )}

        {hasMany && (
          <>
            <button type="button" className={s.prev} aria-label="Previous media" onClick={goPrev}>
              <Icon iconId="arrow-ios-back-outline" />
            </button>
            <button type="button" className={s.next} aria-label="Next media" onClick={goNext}>
              <Icon iconId="arrow-ios-forward-outline" />
            </button>
          </>
        )}

        {hasMany && (
          <div className={s.dots} role="tablist" aria-label="Media pagination">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                className={i === safeIndex ? s.dot_active : s.dot}
                aria-label={`Go to media ${i + 1}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
