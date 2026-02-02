// frontend/src/features/CounterPeople/api/getCountPeople.ts

export interface CountPeopleResponse {
  totalCount: number;
  // Могут быть и другие поля в ответе, если нужно можно добавить
}

import { baseApi } from '@/shared/api/baseApi';

export const getCountPeople = async (): Promise<number> => {
  const data = await baseApi<CountPeopleResponse>('/api/public-user');
  return data.totalCount;
};

// Альтернативная версия с кэшированием (если нужно)
export const getCountPeopleWithCache = async (): Promise<number> => {
  // Здесь можно добавить логику кэширования, например, в localStorage
  // или использовать кэш на уровне HTTP (fetch уже использует кэш по умолчанию)
  return getCountPeople();
};
