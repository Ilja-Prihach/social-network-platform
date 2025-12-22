import styles from "./MessengerPage.module.scss";

export function MessengerPage() {
  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Messenger</h1>
      <p className={styles.description}>
        Chat stub for testing navigation. Integrate your conversations and threads here.
      </p>
    </section>
  );
}
