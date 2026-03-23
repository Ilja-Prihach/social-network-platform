import styles from './UserFeaturePage.module.scss';

export function UserFeaturePage() {
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Feature Layer</p>
        <h1 className="large">User Presence Control</h1>
        <p className="regular_text_16">
          Feature slices orchestrate entity UI plus interaction logic. Toggle statuses to see how
          the shared User entity reflects changes.
        </p>
      </header>
    </section>
  );
}
