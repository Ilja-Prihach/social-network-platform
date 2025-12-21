'use client'

import styles from "./HomePage.module.scss";
import {Button} from "@/src/shared/ui/Button/Button";
import {Sidebar} from "@/src/widgetss/ui/Sidebar/Sidebar";

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
      <h1 className={'regular_link'}>Home Page</h1>
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
      </div>
        <Sidebar/>
        <Button variant="primary">Primary</Button>
        <Button variant="primary" disabled>Primary Disabled</Button>

        <Button variant="secondary">Secondary</Button>
        <Button variant="secondary" disabled>Secondary Disabled</Button>

        <Button variant="outline">Outline</Button>
        <Button variant="outline" disabled>Outline Disabled</Button>

        <Button variant="text">Text</Button>
        <Button variant="text" disabled>Text Disabled</Button>

        <Button href="/" variant="primary">Primary Link</Button>
        <Button href="/" variant="primary" disabled>Primary Link Disabled</Button>

        <Button href="/" variant="secondary">Secondary Link</Button>
        <Button href="/" variant="secondary" disabled>Secondary Link Disabled</Button>

        <Button href="/" variant="outline">Outline Link</Button>
        <Button href="/" variant="outline" disabled>Outline Link Disabled</Button>

        <Button href="/" variant="text">Text Link</Button>
        <Button href="/" variant="text" disabled>Text Link Disabled</Button>
    </section>

  );
}
