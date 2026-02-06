import { baseApi } from '@/shared/api/baseApi';

// ДОБАВЬ export 👇
export interface CountPeopleResponse {
  totalCount: number;
}

export const getCountPeople = async (): Promise<number> => {
  const data = await baseApi<CountPeopleResponse>('/api/v1/public-user');
  return data.totalCount;
};
