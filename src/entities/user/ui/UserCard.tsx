import styles from "./UserCard.module.scss";

import { formatUserStatus, getUserRoleLabel } from "@/entities/user";
import type { User } from "../model/types";

type UserCardProps = {
  user?: User;
};

const fallbackUser: User = {
  id: "user-1",
  fullName: "Alex Johnson",
  email: "alex.johnson@example.com",
  role: "editor",
  status: "online",
  lastActive: "just now",
};

export function UserCard({ user = fallbackUser }: UserCardProps) {
  const roleLabel = getUserRoleLabel(user.role);
  const presenceCopy = formatUserStatus(user);

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div>
          <p className={styles.label}>User</p>
          <h3 className={styles.name}>{user.fullName}</h3>
        </div>
        <span className={styles.role}>{roleLabel}</span>
      </div>
      <p className={styles.email}>{user.email}</p>
      <p className={styles.meta}>{presenceCopy}</p>
    </article>
  );
}
