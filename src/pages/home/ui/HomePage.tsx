import styles from "./HomePage.module.scss";

type HomePageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

const normalizeParam = (value?: string | string[]): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

export function HomePage({ searchParams = {} }: HomePageProps) {
  const postId = normalizeParam(searchParams.postId);
  const action = normalizeParam(searchParams.action);
  const modalMessage = postId
    ? `Post modal placeholder for id ${postId}`
    : action === "create"
      ? "Create post modal placeholder"
      : null;

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Home Page</h1>
      <p className={styles.description}>
        Entry point stub wired through the Feature-Sliced Design layout. Replace with
        the actual landing or feed content.
      </p>
      {modalMessage ? (
        <div className={styles.modal}>
          <p className={styles.modalTitle}>{modalMessage}</p>
          <p className={styles.modalHint}>
            Query-driven modal state. If both postId and action are present, postId takes
            precedence.
          </p>
        </div>
      ) : (
        <p className={styles.placeholder}>
          No modal active. Add ?postId=42 or ?action=create to the URL to preview modal
          handling.
        </p>
      )}
    </section>
  );
}
