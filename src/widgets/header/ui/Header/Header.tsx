'use client';

import { Button } from '@/shared/ui/Button/Button';
import { Icon } from '@/shared/ui/Icon/Icon';
import styles from './Header.module.scss';
import { LanguageSelect } from '@/shared/ui/Select/LanguageSelect/LanguageSelect';
import { useDictionary } from 'next-intlayer';
import headerContent from '../../header.content';

export const Header = () => {
  const content = useDictionary(headerContent);

  return (
    <header>
      <div className={styles.header}>
        <div>
          <p className={styles.logo}>SocialNetwork-AI</p>
        </div>
        <div className={styles.wrapper}>
          <Icon iconId="Outline bell" />
          <LanguageSelect />
          <div className={styles.actions}>
            <Button href="/privacy-policy" variant="text" className={styles.action_button}>
              {content.logIn}
            </Button>
            <Button href="/sign-up" variant="primary" className={styles.action_button}>
              {content.signUp}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
