'use client';

import { useState } from 'react';
import styles from './HomePage.module.scss';
import { Sidebar } from '@/widgets/sidebar/ui/Sidebar';
import { Button } from '@/shared/ui/Button';
import { showModal } from '@/shared/ui/ModalWindow/ModalWindow';
import { Select } from '@/shared/ui/Select/Select';
import { Header } from '@/widgets/header/ui/Header';
import { LanguageSelect } from '@/features/i18n/language-select/ui/LanguageSelect';

type HomePageClientProps = {
  postId?: string;
  action?: string;
};

export function HomePageClient({ postId, action }: HomePageClientProps) {
  const [value, setValue] = useState('');
  const modalMessage = postId
    ? `Post modal placeholder for id ${postId}`
    : action === 'create'
      ? 'Create post modal placeholder'
      : null;

  return (
    <section className={styles.page}>
      <Sidebar />
      <Select
        value={value}
        options={[
          { value: 'Hello', title: 'Select-box' },
          { value: 'Mr', title: 'Mister' },
        ]}
        placeholder={'select ВАЛУЕ'}
        onChange={setValue}
        label={'Select-box'}
      />
      <LanguageSelect />
      <Button
        variant="primary"
        onClick={() =>
          showModal({
            title: 'Email sent',
            description: 'We have sent a link to confirm your email to epam@epam.com',
          })
        }
      >
        open modal
      </Button>
      /<h1>Home Page</h1>
      <p className={'bold_text_16'}>
        Entry point stub wired through the Feature-Sliced Design layout. Replace with the actual
        landing or feed content.
      </p>
      {modalMessage ? (
        <div className={styles.modal}>
          <p>{modalMessage}</p>
          <p className={styles.modalHint}>
            Query-driven modal state. If both postId and action are present, postId takes
            precedence.
          </p>
        </div>
      ) : (
        <p className="large">
          No modal active. Add ?postId=42 or ?action=create to the URL to preview modal handling.
        </p>
      )}
      <Header />
    </section>
  );
}
