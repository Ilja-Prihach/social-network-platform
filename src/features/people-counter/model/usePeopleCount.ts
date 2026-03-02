import { useQuery } from '@tanstack/react-query';
import { getPeopleCount } from '@/features/people-counter/api/getPeopleCount';

export const usePeopleCount = (initialCount?: number | null) => {
  return useQuery<number>({
    queryKey: ['peopleCount'],
    queryFn: getPeopleCount,
    initialData: typeof initialCount === 'number' ? initialCount : undefined,
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    refetchIntervalInBackground: false,
  });
};
