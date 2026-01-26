// frontend/src/features/CounterPeople/api/useCountPeople.ts
import { useState, useEffect } from 'react';
import { getCountPeople } from './getCountPeople';

export const useCountPeople = () => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        setLoading(true);
        const data = await getCountPeople();
        setCount(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Failed to fetch count:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();

    // Опционально: можно добавить интервал для обновления данных
    // const intervalId = setInterval(fetchCount, 60000); // Обновлять каждую минуту
    // return () => clearInterval(intervalId);
  }, []);

  return { count, loading, error };
};
