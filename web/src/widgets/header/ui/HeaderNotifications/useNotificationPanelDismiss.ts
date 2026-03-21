'use client';

import { useEffect, type RefObject } from 'react';

type UseNotificationPanelDismissParams = {
  isOpen: boolean;
  rootRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
};

export const useNotificationPanelDismiss = ({
  isOpen,
  rootRef,
  onClose,
}: UseNotificationPanelDismissParams) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, rootRef]);
};
