// /Users/egorgoroh/Desktop/socialNetwork/frontend/src/widgets/counterPeople/ui/CounterPeople.tsx
import React from 'react';
import Counter from '@/shared/ui/Counter';
import { useCountPeople } from '@/features/people-counter/api/useCountPeople';
import styles from './CounterPeople.module.scss';

const CounterPeople: React.FC = () => {
  const { data, isLoading, error } = useCountPeople();

  if (isLoading) {
    return (
      <div className={styles.counter_people}>
        <span className={styles.label}>Registered users:</span>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (error) {
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
      <Counter value={data || 0} />
    </div>
  );
};

export default CounterPeople;
