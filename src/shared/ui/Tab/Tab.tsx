import React from 'react';
import styles from './Tab.module.scss';

export interface TabProps {
  /**
   * ID таба
   */
  id?: string;
  /**
   * Отображаемый текст
   */
  label: string;
  /**
   * Выбран ли таб
   */
  selected?: boolean;
  /**
   * Заблокирован ли таб
   */
  disabled?: boolean;
  /**
   * Обработчик клика
   */
  onClick?: () => void;
}

export interface TabsContainerProps {
  /**
   * Дочерние элементы (компоненты Tab)
   */
  children: React.ReactNode;
  /**
   * Дополнительные CSS классы
   */
  className?: string;
}

export const Tab: React.FC<TabProps> = ({
  id,
  label,
  selected = false,
  disabled = false,
  onClick,
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <button
      id={id}
      role="tab"
      aria-selected={selected}
      aria-disabled={disabled}
      className={`
        ${styles.tab}
        ${selected ? styles.selected : ''}
        ${disabled ? styles.disabled : ''}
      `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export const TabsContainer: React.FC<TabsContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`${styles.tabsContainer} ${className}`} role="tablist">
      {children}
    </div>
  );
};
