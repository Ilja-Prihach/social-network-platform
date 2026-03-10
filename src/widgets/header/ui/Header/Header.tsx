'use client';

import { Button } from '@/shared/ui/Button/Button';
import { Icon } from '@/shared/ui/Icon/Icon';
import styles from './Header.module.scss';
import { LanguageSelect } from '@/features/i18n/language-select/ui/LanguageSelect';
import { useDictionary } from 'next-intlayer';
import headerContent from '../../header.content';
import { useMe } from '@/features/auth/model/useMe';
import { usePathname } from 'next/navigation';
import type { MeResponse } from '@/entities/user/api/me';

type HeaderProps = {
  initialMe?: MeResponse | null;
};

export const Header = ({ initialMe }: HeaderProps) => {
  const content = useDictionary(headerContent);
  const { data: me, isPending } = useMe();
  const pathname = usePathname();
  const hideAuthActions = Boolean(
    pathname?.includes('/sign-in') ||
    pathname?.includes('/sign-up') ||
    pathname?.includes('/forgot-password'),
  );
  const resolvedMe = me ?? initialMe ?? undefined;
  const authResolved = initialMe !== undefined || !isPending;
  const showAuthSkeleton = !authResolved && !hideAuthActions;

  return (
    <header>
      <div className={styles.header}>
        <div>
          <p className={styles.logo}>SocialNetwork-AI</p>
        </div>
        <div className={styles.wrapper}>
          {me && <Icon iconId="Outline bell" />}
          <LanguageSelect />
          {showAuthSkeleton && (
            <div className={styles.actions} aria-hidden>
              <div className={styles.header_skeleton_circle} />
              <div className={styles.header_skeleton_button} />
              <div className={styles.header_skeleton_button} />
            </div>
          )}
          {!resolvedMe && !isPending && !hideAuthActions && (
            <div className={styles.actions}>
              <Button href="/sign-in" variant="text" className={styles.action_button}>
                {content.logIn}
              </Button>
              <Button href="/sign-up" variant="primary" className={styles.action_button}>
                {content.signUp}
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
