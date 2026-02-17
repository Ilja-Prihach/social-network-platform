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
    formData.append('file', file);
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

  const payload = data as UploadedImageViewModel;
  const uniqueUploadIds = Array.from(new Set(payload.images.map((image) => image.uploadId)));

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
