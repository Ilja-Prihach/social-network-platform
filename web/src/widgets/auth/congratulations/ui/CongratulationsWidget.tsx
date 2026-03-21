'use client';

import styles from './CongratulationsWidget.module.scss';
import { Button } from '@/shared/ui/Button';
import { useDictionary } from 'next-intlayer';
import congratulationsContent from '../congratulations.content';

export function CongratulationsWidget() {
  const content = useDictionary(congratulationsContent);

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <div className={styles.congrat}>
          <div className={styles.congrat_body}>
            <h2 className={styles.congrat_title}>{content.title}</h2>
            <p className={styles.congrat_text}>{content.description}</p>
            <Button href="/sign-in" variant="primary" className={styles.congrat_button}>
              {content.signIn}
            </Button>
            <div className={styles.congrat_image}>
              <img
                src="/congratulations.svg"
                alt={content.imageAlt.value}
                className={styles.congrat_img}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
