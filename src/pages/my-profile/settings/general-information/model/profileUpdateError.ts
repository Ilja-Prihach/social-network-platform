import type { ApiError } from '@/shared/api/types';

export type ProfileUpdateErrorResponse = {
  messages?: string | { message: string; field: string }[];
};

export const getProfileUpdateError = (error: ApiError<ProfileUpdateErrorResponse>) => {
  const messages = error.data?.messages;

  if (typeof messages === 'string') return messages;
  if (Array.isArray(messages) && messages.length && messages[0]?.message) {
    return messages[0].message;
  }

  return 'Failed to update profile';
};
