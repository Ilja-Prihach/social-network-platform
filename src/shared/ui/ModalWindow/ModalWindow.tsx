'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import styles from './ModalWindow.module.scss';

type ModalOptions = {
  title?: string;
  description?: string;
  confirmText?: string; // В этот пропс можно передать текст кнопки
};

// глобальная функция для вызова модалки из любого места
let showModalFunc: (options: ModalOptions) => void;

// функция для вызова модалки
export const showModal = (options: ModalOptions) => {
  showModalFunc?.(options);
};

export const ModalWindow = () => {
  const [modalProps, setModalProps] = useState<ModalOptions | null>(null);

  useEffect(() => {
    showModalFunc = (options: ModalOptions) => {
      setModalProps(options);
    };
  }, []);

  if (!modalProps) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.title_wrapper}>
          {modalProps.title && <h2 className={styles.title}>{modalProps.title}</h2>}
          <Button variant="text" onClick={() => setModalProps(null)}>
            <Icon iconId="close-outline" style={{ color: 'var(--light-100-color)' }} />
          </Button>
        </div>

        {modalProps.description && <p className={styles.description}>{modalProps.description}</p>}

        <div className={styles.button_wrapper}>
          <Button variant="primary" onClick={() => setModalProps(null)}>
            {modalProps.confirmText || 'OK'}
          </Button>
        </div>
      </div>
    </div>
  );
};
//Пример из тестовой компоненты, где по клику на кнопку вызывается schowModal() и
// отбражается модальное окно
// <Button
//   variant="primary"
//   onClick={() =>
//     showModal({
//       title: 'Email sent',
//       description: 'We have sent a link to confirm your email to epam@epam.com',
//     })
//   }
// >
//   open modal
// </Button>

// Отдельно функция вызова модального окна
// showModal({
//       title: 'Email sent',
//        description: 'We have sent a link to confirm your email to epam@epam.com',
//})
