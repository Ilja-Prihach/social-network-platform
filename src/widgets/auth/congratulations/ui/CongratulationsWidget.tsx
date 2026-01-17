import styles from './CongratulationsWidget.module.scss';
import { Button } from '@/shared/ui/Button';

export function CongratulationsWidget() {
  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <div className={styles.congrat}>
          <div className={styles.congrat_body}>
            <h2 className={styles.congrat_title}>Congratulations!</h2>
            <p className={styles.congrat_text}>Your email has been confirmed</p>
            <Button href="/sign-in" variant="primary" className={styles.congrat_button}>
              Sign In
            </Button>
            <div className={styles.congrat_image}>
              <img
                src="/congratulations.svg"
                alt="Congratulations"
                className={styles.congrat_img}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
