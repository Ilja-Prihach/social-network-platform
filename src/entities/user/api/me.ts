import { baseApi } from '@/shared/api/baseApi';

export type MeResponse = {
  userId: number;
  userName: string;
  email: string;
  isBlocked: boolean;
};

export const getMe = () => baseApi<MeResponse>('/api/v1/auth/me');
