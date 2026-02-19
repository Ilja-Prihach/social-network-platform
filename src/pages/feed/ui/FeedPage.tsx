import styles from './FeedPage.module.scss';
import { DatePickerPreview } from '@/pages/feed/ui/DatePickerPreview';

export function FeedPage() {
  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Feed</h1>
      <p className={styles.description}>Date Picker implementation from Figma context.</p>
      <DatePickerPreview />
    </section>
  );
}
