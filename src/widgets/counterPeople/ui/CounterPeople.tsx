// CounterPeople.tsx
import React from 'react';
import Counter from '@/shared/ui/Counter';
import { useCountPeople } from '@/features/CounterPeople/api/useCountPeople';
import styles from './CounterPeople.module.scss';

const CounterPeople: React.FC = () => {
  const { count, loading, error } = useCountPeople();

  if (loading) {
    return (
      <div className={styles.counter_people}>
        <span className={styles.label}>Registered users:</span>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading count:', error);
    return (
      <div className={styles.counter_people}>
        <span className={styles.label}>Registered users:</span>
        <div className={styles.error}>-</div>
      </div>
    );
  }

  return (
    <div className={styles.counter_people}>
      <span className={styles.label}>Registered users:</span>
      <Counter value={count} />
    </div>
  );
};

export default CounterPeople;
