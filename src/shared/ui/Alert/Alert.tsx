'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Button } from '@/shared/ui/Button/Button';
import styles from './Alert.module.scss';
import { Icon } from '@/shared/ui/Icon/Icon';

type AlertVariant = 'success' | 'error';

type Toast = {
  id: string;
  text: string;
  variant: AlertVariant;
};

// Глобальная функция для вызова алерта из любого места
let showAlertFunc: (text: string, variant: AlertVariant) => void;

export const showAlert = (text: string, variant: AlertVariant) => {
  showAlertFunc?.(text, variant);
};

export const Alert = () => {
  const [alerts, setAlerts] = useState<Toast[]>([]);

  useEffect(() => {
    showAlertFunc = (text: string, variant: AlertVariant) => {
      const id = crypto.randomUUID();
      setAlerts((prev) => [...prev, { id, text, variant }]);

      setTimeout(() => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
      }, 4000);
    };
  }, []);

  return (
    <div className={styles.container}>
      {alerts.map((alert) => (
        <div key={alert.id} className={clsx(styles.alert, styles[alert.variant])}>
          <span>{alert.text}</span>
          <Button
            variant="text"
            className={styles.close_button}
            onClick={() => setAlerts((prev) => prev.filter((a) => a.id !== alert.id))}
          >
            <Icon iconId="close-outline" style={{ color: 'var(--light-100-color)' }} />
          </Button>
        </div>
      ))}
    </div>
  );
};

//как использовать, на примере кнопки
// onClick={() => showAlert("Your settings are saved", "success")}
// onClick={() => showAlert("Error! Server is not available", "error")}
