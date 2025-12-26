import { Button } from '@/shared/ui/Button/Button';
import { Icon } from '@/shared/ui/Icon/Icon';
import styles from './Header.module.scss';

export const Header = () => {
  return (
    <header>
      <div className={styles.header}>
        <div>
          <p className={styles.logo}>SocialNetwork-AI</p>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.select}>
            <Icon iconId="flag-united-kingdom" />
            <p>Select</p>
          </div>
          <Button href="/privacy-policy" variant="text">
            Log in
          </Button>
          <Button href="/sign-up" variant="primary">
            Sign up
          </Button>
        </div>
      </div>
    </header>
  );
};
