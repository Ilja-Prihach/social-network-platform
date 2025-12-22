import styles from "./MyProfilePage.module.scss";

export function MyProfilePage() {
  return (
    <section className={styles.page}>
      <h1 className={styles.title}>My Profile</h1>
      <p className={styles.description}>
        Stubbed personal profile view. Wire this up to user data and profile settings.
      </p>
    </section>
  );
}
