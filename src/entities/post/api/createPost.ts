import { baseApi } from '@/shared/api/baseApi';

type PostImageDto = {
  uploadId: string;
  url: string;
  width: number;
  height: number;
  fileSize: number;
  createdAt: string;
};

type UploadedImageViewModel = {
  images: PostImageDto[];
};

type CreatePostPayload = {
  description: string | null;
  childrenMetadata: Array<{ uploadId: string }>;
};

export type CreatedPostDto = {
  id: number;
  description: string;
  location: string;
  images: PostImageDto[];
  createdAt: string;
};

export async function uploadPostImages(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await fetch('/api/posts/image', {
    method: 'POST',
    body: formData,
  });

  const text = await response.text();
  let data: unknown = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    throw {
      status: response.status,
      data,
    };
  }

  const payload = data as UploadedImageViewModel | null;
  const images = Array.isArray(payload?.images) ? payload.images : [];
  const uniqueUploadIds = Array.from(
    new Set(
      images
        .map((image) => image?.uploadId)
        .filter(
          (uploadId): uploadId is string => typeof uploadId === 'string' && uploadId.length > 0,
        ),
    ),
  );

  if (uniqueUploadIds.length === 0) {
    throw {
      status: response.status,
      data: {
        message: 'Unable to upload one or more photos. Please try again',
      },
    };
  }

  return uniqueUploadIds;
}

export async function createPost(payload: CreatePostPayload): Promise<CreatedPostDto> {
  return baseApi<CreatedPostDto>('/api/posts', {
    method: 'POST',
    body: payload,
  });
}

export async function deletePostImage(uploadId: string): Promise<void> {
  await baseApi<void>(`/api/posts/image/${uploadId}`, {
    method: 'DELETE',
  });
}
