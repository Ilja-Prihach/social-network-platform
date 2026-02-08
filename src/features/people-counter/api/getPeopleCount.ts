import { baseApi } from '@/shared/api/baseApi';

// ДОБАВЬ export 👇
export interface PeopleCountResponse {
  totalCount: number;
}

export const getPeopleCount = async (): Promise<number> => {
  const data = await baseApi<PeopleCountResponse>('/api/public-user');
  return data.totalCount;
};
