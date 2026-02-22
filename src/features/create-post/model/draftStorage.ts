import type { CreateDraft, DraftPhoto, PhotoItem } from './types';

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function hasStoredDraft(storageKey: string): boolean {
  if (typeof window === 'undefined') return false;

  return Boolean(localStorage.getItem(storageKey));
}

export async function toDraftPhotos(photos: PhotoItem[]): Promise<DraftPhoto[]> {
  return Promise.all(
    photos.map(async (photo) => {
      if (!photo.revokable) {
        return {
          id: photo.id,
          name: photo.name,
          type: photo.type,
          size: photo.size,
          upload_id: photo.upload_id,
          preview_url: photo.preview_url,
        };
      }

      const photoResponse = await fetch(photo.preview_url);
      const photoBlob = await photoResponse.blob();
      const fileLike = new File([photoBlob], photo.name, { type: photo.type });
      const previewData = await fileToDataUrl(fileLike);

      return {
        id: photo.id,
        name: photo.name,
        type: photo.type,
        size: photo.size,
        upload_id: photo.upload_id,
        preview_url: previewData,
      };
    }),
  );
}

export function saveDraft(storageKey: string, draft: CreateDraft): void {
  localStorage.setItem(storageKey, JSON.stringify(draft));
}

export function readDraft(storageKey: string): CreateDraft | null {
  const rawDraft = localStorage.getItem(storageKey);
  if (!rawDraft) return null;

  try {
    return JSON.parse(rawDraft) as CreateDraft;
  } catch {
    localStorage.removeItem(storageKey);
    return null;
  }
}

export function clearDraft(storageKey: string): void {
  localStorage.removeItem(storageKey);
}

export function toPhotoItems(draft: CreateDraft): PhotoItem[] {
  return draft.photos.map((photo) => ({
    ...photo,
    upload_id: photo.upload_id ?? null,
    revokable: false,
  }));
}
