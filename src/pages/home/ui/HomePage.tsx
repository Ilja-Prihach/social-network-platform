'use client'

import styles from "./HomePage.module.scss";

import {showAlert} from "@/shared/ui/Alert/Alert";





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
      <h1>Home Page</h1>
      <p className={'bold_text_16'}>
        Entry point stub wired through the Feature-Sliced Design layout. Replace with
        the actual landing or feed content.
      </p>
      {modalMessage ? (
        <div className={styles.modal}>
          <p>{modalMessage}</p>
          <p className={styles.modalHint}>
            Query-driven modal state. If both postId and action are present, postId takes
            precedence.
          </p>
        </div>
      ) : (
        <p className='large'>
          No modal active. Add ?postId=42 or ?action=create to the URL to preview modal
          handling.
        </p>
      )}

      <div style={{ padding: "20px", display: "flex", gap: "12px" }}>
        <button
            onClick={() => showAlert("Your settings are saved", "success")}
            style={{ padding: "8px 16px" }}
        >
          Success
        </button>

        <button
            onClick={() => showAlert("Error! Server is not availableError! Server is not availableError! Server is not availableError! Server is not availableError! Server is not availableError! Server is not availableError! Server is not availableError! Server is not availableError! Server is not availableError! Server is not availableError! Server is not availableError! Server is not available", "error")}
            style={{ padding: "8px 16px" }}
        >
          Error
        </button>
      </div>

    </section>

  );
}
