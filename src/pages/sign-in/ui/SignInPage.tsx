'use client';

import styles from './SignInPage.module.scss';
import { Icon } from '@/shared/ui/Icon';
import { Button } from '@/shared/ui/Button';
import { SignInForm } from '@/features/auth/sign-in-form/ui/SignInForm';
import { useDictionary } from 'next-intlayer';
import signInContent from '../sign-in.content';

export function SignInPage() {
  const content = useDictionary(signInContent);

  return (
    <section className={styles.container}>
      <div className={styles.content}>
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
              color={'white'}
            />
          </a>
        </div>
        <SignInForm />
        <p className={styles.text}>{content.noAccount}</p>
        <Button href="/sign-up" variant="text">
          {content.signUp}
        </Button>
      </div>
    </section>
  );
}
