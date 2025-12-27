'use client';

import styles from './HomePage.module.scss';
import { Header } from '@/widgets/header/ui/Header';
import { Sidebar } from '@/widgets/sidebar/ui/Sidebar';
import { Button } from '@/shared/ui/Button';
import { showModal } from '@/shared/ui/ModalWindow/ModalWindow';
import { Select } from '@/shared/ui/Select/Select';

type HomePageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

const normalizeParam = (value?: string | string[]): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

export function HomePage({ searchParams = {} }: HomePageProps) {
  const postId = normalizeParam(searchParams.postId);
  const action = normalizeParam(searchParams.action);
  const modalMessage = postId
    ? `Post modal placeholder for id ${postId}`
    : action === 'create'
      ? 'Create post modal placeholder'
      : null;

  return (
    <section className={styles.page}>
      <Sidebar />
      <Select
        options={[
          { value: 'Hello', title: 'Moto' },
          { value: 'Mr', title: 'Mister' },
        ]}
        placeholder={'select ВАЛУЕ'}
      />
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
