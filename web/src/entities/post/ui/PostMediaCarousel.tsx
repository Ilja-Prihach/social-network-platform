'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import type { PostMedia } from '../model/types';
import { Icon } from '@/shared/ui/Icon';
import { useDictionary } from 'next-intlayer';
import s from './PostMediaCarousel.module.scss';
import type { MouseEvent } from 'react';
import postMediaCarouselContent from './post-media-carousel.content';

type Props = {
  media: PostMedia[];
  variant?: 'compact' | 'feed';
};

export function PostMediaCarousel({ media, variant = 'compact' }: Props) {
  const dictionary = useDictionary(postMediaCarouselContent);
  const items = useMemo(() => media ?? [], [media]);
  const [index, setIndex] = useState(0);

  const hasMany = items.length > 1;
  const safeIndex = clamp(index, 0, Math.max(0, items.length - 1));
  const current = items[safeIndex];

  const goPrev = () => setIndex((i) => (i <= 0 ? items.length - 1 : i - 1));
  const goNext = () => setIndex((i) => (i >= items.length - 1 ? 0 : i + 1));

  const handleControlClick = (action: () => void) => (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    action();
  };

  if (!current) {
    return null;
  }

  return (
    <div className={s.root}>
      <div className={variant === 'feed' ? `${s.viewport} ${s.viewport_feed}` : s.viewport}>
        <Image
          src={current.src}
          alt={current.alt || dictionary.postMediaAlt.value}
          fill
          sizes="(max-width: 768px) 100vw, 420px"
          className={s.media}
          priority={false}
        />

        {hasMany && (
          <>
            <button
              type="button"
              className={variant === 'feed' ? `${s.prev} ${s.prev_feed}` : s.prev}
              aria-label={dictionary.previousMedia.value}
              onClick={handleControlClick(goPrev)}
            >
              <Icon iconId="arrow-ios-back-outline" />
            </button>
            <button
              type="button"
              className={variant === 'feed' ? `${s.next} ${s.next_feed}` : s.next}
              aria-label={dictionary.nextMedia.value}
              onClick={handleControlClick(goNext)}
            >
              <Icon iconId="arrow-ios-forward-outline" />
            </button>
          </>
        )}

        {hasMany && (
          <div
            className={variant === 'feed' ? `${s.dots} ${s.dots_feed}` : s.dots}
            role="tablist"
            aria-label={dictionary.mediaPagination.value}
          >
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                className={i === safeIndex ? s.dot_active : s.dot}
                aria-label={`${dictionary.goToMediaPrefix.value} ${i + 1}`}
                onClick={handleControlClick(() => setIndex(i))}
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
