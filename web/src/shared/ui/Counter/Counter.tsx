// /Users/egorgoroh/Desktop/socialNetwork/frontend/src/shared/ui/Counter/Counter.tsx
import React from 'react';
import styles from './Counter.module.scss';

interface CounterProps {
  value: number;
}

const Counter: React.FC<CounterProps> = ({ value }) => {
  const formattedValue = Math.abs(value).toString().padStart(6, '0');
  const digits = formattedValue.split('');

  return (
    <div className={styles.counter}>
      {digits.map((digit, index) => (
        <React.Fragment key={index}>
          <div className={styles.digit}>{digit}</div>
          {index < digits.length - 1 && <div className={styles.divider} />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Counter;
