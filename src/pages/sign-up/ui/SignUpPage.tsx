'use client';

import styles from './SignUpPage.module.scss';
import { Icon } from '@/shared/ui/Icon';
import { SignUpForm } from '@/widgets/auth/sign-up-form';
import { Button } from '@/shared/ui/Button';
import { useDictionary } from 'next-intlayer';
import signUpContent from '../sign-up.content';

export function SignUpPage() {
  const content = useDictionary(signUpContent);

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <div className={styles.sign}>
          <h2 className={styles.title}>{content.title}</h2>

          <div className={styles.head}>
            <a href="#" className={styles.soc_enter}>
              <Icon iconId={'google-svgrepo-com 1'} width={'36px'} height={'36px'} />
            </a>
            <a href="#" className={styles.soc_enter}>
              <Icon
                iconId={'github-svgrepo-com (3) 1'}
                width={'36px'}
                height={'36px'}
                style={{ color: 'var(--light-100-color)' }}
              />
            </a>
          </div>

          <SignUpForm />

          <p className={styles.text}>{content.hasAccount}</p>
          <Button href="/sign-in" variant="text">
            {content.signIn}
          </Button>
        </div>
      </div>
    </section>
  );
}
