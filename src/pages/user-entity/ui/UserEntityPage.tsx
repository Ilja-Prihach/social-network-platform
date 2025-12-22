import styles from "./UserEntityPage.module.scss";

import { UserCard, type User } from "@/entities/user";

const showcaseUser: User = {
  id: "user-007",
  fullName: "Jordan Lee",
  email: "jordan.lee@example.com",
  role: "viewer",
  status: "online",
  lastActive: "just now",
};

export function UserEntityPage() {
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Entity Layer</p>
        <h1 className="large">User Entity</h1>
        <p className="regular_text_16">
          The entity exposes typed models plus focused UI. It keeps business-agnostic user
          rendering separate from higher-level flows.
        </p>
      </header>

      <div className={styles.cardArea}>
        <UserCard user={showcaseUser} />
      </div>

      <div className={styles.notes}>
        <p className="regular_text_16">
          Use this slice when you need consistent user display (name, role, presence) without
          coupling to page-specific interactions.
        </p>
      </div>
    </section>
  );
}
