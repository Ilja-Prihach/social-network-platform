import React from 'react';
import Counter from '@/shared/ui/Counter';
import styles from './PeopleCounter.module.scss';
import { usePeopleCount } from '@/features/people-counter';

type PeopleCounterProps = {
  initialCount?: number | null;
};

const PeopleCounter: React.FC<PeopleCounterProps> = ({ initialCount }) => {
  const { data, isLoading, error } = usePeopleCount(initialCount);

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

export default PeopleCounter;
