'use client'

import styles from "./HomePage.module.scss";
import {Button} from "@/shared/ui/Button/Button";

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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        <h3>Button </h3>
        <Button variant="primary" onClick={() => alert('clicked!')}>Primary</Button>
        <Button variant="primary" disabled>Primary Disabled</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="secondary" disabled>Secon Dis</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="outline" disabled>Outline Disabled</Button>
        <Button variant="text">Text</Button>
        <Button variant="text" disabled>Text Disabled</Button>

        <h3>Link (Next.js Link)</h3>
        <Button href="/privacy-policy" variant="primary">Primary Link</Button>
        <Button href="/privacy-policy" variant="primary" disabled>Primary Link Disabled</Button>
        <Button href="/privacy-policy" variant="secondary">Secondary Link</Button>
        <Button href="/privacy-policy" variant="secondary" disabled>Secondary Link Disabled</Button>
        <Button href="/privacy-policy" variant="outline">Outline Link</Button>
        <Button href="/privacy-policy" variant="outline" disabled>Outline Link Disabled</Button>
        <Button href="/privacy-policy" variant="text">Text Link</Button>
        <Button href="/privacy-policy" variant="text" disabled>Text Link Disabled</Button>

      </div>
    </section>

  );
}
