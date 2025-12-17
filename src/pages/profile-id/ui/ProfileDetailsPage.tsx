import styles from "./ProfileDetailsPage.module.scss";

type ProfileDetailsPageProps = {
  params: { id: string };
};

export function ProfileDetailsPage({ params }: ProfileDetailsPageProps) {
  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Profile Page</h1>
      <p className={styles.description}>Profile details stub for user {params.id}.</p>
    </section>
  );
}
