'use client';

import { useMemo, useState } from 'react';

export function useToggleText(text: string, clampChars: number) {
  const [isExpanded, setExpanded] = useState(false);

  const canExpand = text.length > clampChars;

  const shownText = useMemo(() => {
    if (isExpanded || !canExpand) {
      return text;
    }

    const rawSlice = text.slice(0, clampChars);
    const lastSpaceIndex = rawSlice.lastIndexOf(' ');

    if (lastSpaceIndex > Math.floor(clampChars * 0.6)) {
      return rawSlice.slice(0, lastSpaceIndex);
    }

    return rawSlice;
  }, [text, clampChars, isExpanded, canExpand]);

  const toggle = () => setExpanded((v) => !v);

  return {
    shownText,
    canExpand,
    isExpanded,
    toggle,
  };
}
