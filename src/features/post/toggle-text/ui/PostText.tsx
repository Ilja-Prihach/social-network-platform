'use client';

import { useEffect, useRef, useState } from 'react';
import s from './PostText.module.scss';

const CLAMP_HEIGHT = 72;

type Props = {
  text: string;
};

export function PostText({ text }: Props) {
  const [isExpanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const isOverflowing = el.scrollHeight > CLAMP_HEIGHT + 1;
    setCanExpand(isOverflowing);
  }, [text]);

  const toggle = () => setExpanded((v) => !v);

  return (
    <div className={s.root}>
      <p className={s.text}>
        <span ref={textRef} className={`${s.text_content} ${!isExpanded ? s.text_clamped : ''}`}>
          {text}
        </span>
        {!isExpanded && canExpand && <span className={s.ellipsis}>…</span>}
        {canExpand && (
          <>
            {' '}
            <button type="button" className={s.toggle} onClick={toggle}>
              {isExpanded ? 'Hide' : 'Show more'}
            </button>
          </>
        )}
      </p>
    </div>
  );
}
