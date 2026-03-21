'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useDictionary } from 'next-intlayer';
import { usePostTranslation } from '../model/usePostTranslation';
import postTextContent from './post-text.content';
import s from './PostText.module.scss';

const EXPAND_FALLBACK_THRESHOLD_CHARS = 110;

type Props = {
  text: string;
};

export function PostText({ text }: Props) {
  const dictionary = useDictionary(postTextContent);
  const {
    text: shownText,
    isTranslating,
    isTranslationShown,
    toggleTranslation,
    canTranslate,
    errorCode,
  } = usePostTranslation(text);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isExpanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const updateCanExpand = useCallback(() => {
    const el = textRef.current;
    if (!el) {
      setIsOverflowing(false);
      return;
    }

    const next = el.scrollHeight > el.clientHeight + 1;
    setIsOverflowing((prev) => (prev === next ? prev : next));
  }, []);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      updateCanExpand();
    });

    observer.observe(el);

    const frameId = requestAnimationFrame(() => {
      updateCanExpand();
    });

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [shownText, isExpanded, updateCanExpand]);

  const toggle = () => setExpanded((value) => !value);
  const canExpand =
    isExpanded || isOverflowing || shownText.length > EXPAND_FALLBACK_THRESHOLD_CHARS;

  return (
    <div className={s.root}>
      <p className={s.text}>
        <span ref={textRef} className={`${s.text_content} ${!isExpanded ? s.text_clamped : ''}`}>
          {shownText}
        </span>
        {canExpand && (
          <>
            {' '}
            <button type="button" className={s.toggle} onClick={toggle}>
              {isExpanded ? dictionary.hide : dictionary.showMore}
            </button>
          </>
        )}
      </p>
      {!isTranslating && canTranslate && (
        <button
          type="button"
          className={s.translate_toggle}
          onClick={() => void toggleTranslation()}
        >
          {isTranslationShown ? dictionary.seeOriginal : dictionary.seeTranslation}
        </button>
      )}
      {isTranslating && <span className={s.status}>{dictionary.translating}</span>}
      {errorCode === 'not_found' && (
        <span className={s.error}>{dictionary.translationRouteMissing}</span>
      )}
      {errorCode === 'failed' && <span className={s.error}>{dictionary.translationFailed}</span>}
    </div>
  );
}
