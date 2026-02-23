import { baseApi } from '@/shared/api/baseApi';
import type {
  GetPublicProfilePostsParams,
  MyProfile,
  ProfilePostsPage,
  PublicProfile,
  UploadProfileAvatarResponse,
  UpdateProfileRequest,
} from '../model/types';
import {
  buildProfilePostsPath,
  mapProfilePostsPage,
  PROFILE_POSTS_PAGE_SIZE,
  type RawProfilePostsResponse,
} from './profileApi.shared';

export { PROFILE_POSTS_PAGE_SIZE };

export function getPublicProfile(profileId: number) {
  return baseApi<PublicProfile>(`/api/public-user/profile/${profileId}`);
}

export function getMyProfile() {
  return baseApi<MyProfile>('/api/users/profile');
}

export function updateProfile(data: UpdateProfileRequest) {
  return baseApi<void>('/api/users/profile', {
    method: 'PUT',
    body: data,
  });
}

export async function uploadProfileAvatar(file: File): Promise<UploadProfileAvatarResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/users/profile/avatar', {
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

  return data as UploadProfileAvatarResponse;
}

export function deleteProfileAvatar() {
  return baseApi<void>('/api/users/profile/avatar', {
    method: 'DELETE',
  });
}

export async function getPublicProfilePostsPage({
  profileId,
  endCursorPostId,
  pageSize = PROFILE_POSTS_PAGE_SIZE,
}: GetPublicProfilePostsParams): Promise<ProfilePostsPage> {
  const data = await baseApi<RawProfilePostsResponse>(
    buildProfilePostsPath({ profileId, endCursorPostId, pageSize }),
  );

  return mapProfilePostsPage(data, pageSize);
}
