// /Users/egorgoroh/Desktop/socialNetwork/frontend/src/features/people-counter/api/useCountPeople.ts
import { useQuery } from '@tanstack/react-query';
import { getCountPeople } from './getCountPeople';

export const useCountPeople = () => {
  return useQuery({
    queryKey: ['countPeople'], // Ключ кэша
    queryFn: getCountPeople, // Функция запроса
    staleTime: 5 * 60 * 1000, // ⏱️ 5 минут "свежести" (не запрашивает новые данные)
    gcTime: 10 * 60 * 1000, // 🗑️ 10 минут хранения в кэше
  });
};
