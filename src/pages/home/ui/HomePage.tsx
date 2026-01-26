'use client';

import styles from './HomePage.module.scss';

import { Sidebar } from '@/widgets/sidebar/ui/Sidebar';
import { Button } from '@/shared/ui/Button';
import { showModal } from '@/shared/ui/ModalWindow/ModalWindow';
import { Select } from '@/shared/ui/Select/Select';
import { useState } from 'react';
import { Header } from '@/widgets/header/ui/Header';
import { LanguageSelect } from '@/shared/ui/Select/LanguageSelect/LanguageSelect';
import { useDictionary } from 'next-intlayer';
import homeContent from '../home.content';

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
  const [value, setValue] = useState('');
  const content = useDictionary(homeContent);
  const postId = normalizeParam(searchParams.postId);
  const action = normalizeParam(searchParams.action);
  const modalMessage = postId
    ? `${content.postModalPrefix.value} ${postId}`
    : action === 'create'
      ? content.createModal.value
      : null;

  return (
    <section className={styles.page}>
      <Sidebar />
      <Select
        value={value}
        options={[
          { value: 'Hello', title: content.selectOptionSelectBox.value },
          { value: 'Mr', title: content.selectOptionMister.value },
        ]}
        placeholder={content.selectPlaceholder.value}
        onChange={setValue}
        label={content.selectLabel.value}
      />
      <LanguageSelect />
      <Button
        variant="primary"
        onClick={() =>
          showModal({
            title: content.modalTitle.value,
            description: content.modalDescription.value,
          })
        }
      >
        {content.openModalButton}
      </Button>
      <h1>{content.heading}</h1>
      <p className={'bold_text_16'}>
        {content.intro}
      </p>
      {modalMessage ? (
        <div className={styles.modal}>
          <p>{modalMessage}</p>
          <p className={styles.modalHint}>
            {content.modalHint}
          </p>
        </div>
      ) : (
        <p className="large">
          {content.noModal}
        </p>
      )}
      <Header />
    </section>
  );
}
