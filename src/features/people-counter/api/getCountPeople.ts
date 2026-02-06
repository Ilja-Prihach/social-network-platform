// /Users/egorgoroh/Desktop/socialNetwork/frontend/src/features/people-counter/api/getCountPeople.ts
import { baseApi } from '@/shared/api/baseApi';

// ДОБАВЬ export 👇
export interface CountPeopleResponse {
  totalCount: number;
}

export const getCountPeople = async (): Promise<number> => {
  const data = await baseApi<CountPeopleResponse>('/api/v1/auth/public-user');
  return data.totalCount;
};
