import { LanguageSelect } from '@i18n-ui/language-select';
import { HeaderShell } from '@layout-ui/header-shell';
import styles from './AdminHeader.module.scss';

export function AdminHeader() {
  return (
    <HeaderShell
      logo={
        <p className={styles.logo}>
          <span className={styles.logo_main}>SocialNetwork-AI</span>
          <span className={styles.logo_suffix}>SuperAdmin</span>
        </p>
      }
      controls={<LanguageSelect />}
    />
  );
}
