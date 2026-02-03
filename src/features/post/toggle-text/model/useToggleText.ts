'use client';

import { useMemo, useState } from 'react';

export function useToggleText(text: string, clampChars: number) {
  const [isExpanded, setExpanded] = useState(false);

  const canExpand = text.length > clampChars;

  const shownText = useMemo(() => {
    if (isExpanded || !canExpand) {
      return text;
    }
    return text.slice(0, clampChars);
  }, [text, clampChars, isExpanded, canExpand]);

  const toggle = () => setExpanded((v) => !v);

  return {
    shownText,
    canExpand,
    isExpanded,
    toggle,
  };
}
