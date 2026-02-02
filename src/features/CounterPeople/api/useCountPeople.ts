// frontend/src/features/CounterPeople/api/useCountPeople.ts
import { useState, useEffect } from 'react';
import { getCountPeople } from './getCountPeople';

export const useCountPeople = () => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getErrorMessage = (err: unknown) => {
    if (err instanceof Error && err.message) return err.message;
    if (err && typeof err === 'object') {
      const data = (err as { data?: { message?: string; error?: string } }).data;
      if (data?.message) return data.message;
      if (data?.error) return data.error;
      const status = (err as { status?: number }).status;
      if (typeof status === 'number') return `Request failed (${status})`;
    }
    return 'Unknown error';
  };

  useEffect(() => {
    const fetchCount = async () => {
      try {
        setLoading(true);
        const data = await getCountPeople();
        setCount(data);
        setError(null);
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
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
