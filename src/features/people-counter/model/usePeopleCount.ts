import { useQuery } from '@tanstack/react-query';
import { getPeopleCount } from '@/features/people-counter/api/getPeopleCount';

export const usePeopleCount = () => {
  return useQuery({
    queryKey: ['peopleCount'], // Ключ кэша
    queryFn: getPeopleCount, // Функция запроса
    staleTime: 5 * 60 * 1000, // ⏱️ 5 минут "свежести" (не запрашивает новые данные)
    gcTime: 10 * 60 * 1000, // 🗑️ 10 минут хранения в кэше
  });
};
