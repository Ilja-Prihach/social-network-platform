import React from 'react';
import styles from './Counter.module.scss';

interface CounterProps {
  value: number;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const Counter: React.FC<CounterProps> = ({ value, onClick, onMouseEnter, onMouseLeave }) => {
  // Проверка что value целое число
  if (!Number.isInteger(value)) {
    throw new Error('Counter value must be an integer');
  }

  // Проверка что value положительное
  if (value < 0) {
    throw new Error('Counter value must be a positive number');
  }

  // Форматируем число с ведущими нулями до 6 цифр
  const formattedValue = value.toString().padStart(6, '0');
  const digits = formattedValue.split('');

  return (
    <div
      className={styles.counter}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
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
