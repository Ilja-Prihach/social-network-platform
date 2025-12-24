import React from 'react';
import styles from './counter.module.scss';

/*   Пример использования !
<Counter value={123123}/>     */


interface CounterProps {
    value: number;
}

const Counter: React.FC<CounterProps> = ({ value }) => {
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
        <div className={styles.counter}>
            {digits.map((digit, index) => (
                <React.Fragment key={index}>
                    <div className={styles.digit}>
                        {digit}
                    </div>
                    {index < digits.length - 1 && (
                        <div className={styles.divider} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default Counter;