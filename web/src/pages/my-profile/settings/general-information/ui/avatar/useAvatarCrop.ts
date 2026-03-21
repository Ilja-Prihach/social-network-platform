import type { PointerEvent as ReactPointerEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

type UseAvatarCropParams = {
  modalPreviewUrl: string | null;
  pendingFile: File | null;
  cropSize: number;
  outputSize: number;
};

export const useAvatarCrop = ({
  modalPreviewUrl,
  pendingFile,
  cropSize,
  outputSize,
}: UseAvatarCropParams) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const dragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  useEffect(() => {
    if (!modalPreviewUrl) return;

    const img = new Image();
    img.onload = () => {
      setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
      setOffset({ x: 0, y: 0 });
    };
    img.src = modalPreviewUrl;
  }, [modalPreviewUrl]);

  const scale = useMemo(() => {
    if (!naturalSize.width || !naturalSize.height) return 1;
    return Math.max(cropSize / naturalSize.width, cropSize / naturalSize.height);
  }, [cropSize, naturalSize]);

  const clampOffset = (x: number, y: number) => {
    const maxX = Math.max(0, (naturalSize.width * scale - cropSize) / 2);
    const maxY = Math.max(0, (naturalSize.height * scale - cropSize) / 2);

    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    };
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!modalPreviewUrl) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.x,
      originY: offset.y,
    };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = event.clientX - dragRef.current.startX;
    const dy = event.clientY - dragRef.current.startY;
    setOffset(clampOffset(dragRef.current.originX + dx, dragRef.current.originY + dy));
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
  };

  const buildCroppedFile = async () => {
    if (!pendingFile || !modalPreviewUrl || !naturalSize.width || !naturalSize.height || !scale) {
      return null;
    }

    const img = new Image();
    img.src = modalPreviewUrl;
    await img.decode();

    const cropSizeInPixels = cropSize / scale;
    const cropX = (-cropSize / 2 - offset.x) / scale + naturalSize.width / 2;
    const cropY = (-cropSize / 2 - offset.y) / scale + naturalSize.height / 2;

    const canvas = document.createElement('canvas');
    canvas.width = outputSize;
    canvas.height = outputSize;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(
      img,
      cropX,
      cropY,
      cropSizeInPixels,
      cropSizeInPixels,
      0,
      0,
      outputSize,
      outputSize,
    );

    const mime = pendingFile.type === 'image/png' ? 'image/png' : 'image/jpeg';
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((value) => resolve(value), mime, 0.92),
    );

    if (!blob) return null;
    return new File([blob], pendingFile.name, { type: mime });
  };

  return {
    offset,
    scale,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    buildCroppedFile,
  };
};
