'use client'
import { useState } from "react";

import styles from "./UserPresenceControl.module.scss";

import { UserCard, type User, type UserStatus } from "@/entities/user";
import { getPresenceText } from "../lib/getPresenceText";
import type { UserPresenceControlProps } from "../model/types";

const statusOptions: { value: UserStatus; label: string }[] = [
  { value: "online", label: "Online" },
  { value: "idle", label: "Idle" },
  { value: "offline", label: "Offline" },
];

const demoUser: User = {
  id: "user-42",
  fullName: "Taylor Moore",
  email: "taylor.moore@example.com",
  role: "admin",
  status: "idle",
  lastActive: "5 minutes ago",
};

export function UserPresenceControl({ user = demoUser }: UserPresenceControlProps) {
  const [currentUser, setCurrentUser] = useState<User>(user);

  const handleStatusChange = (status: UserStatus) => {
    setCurrentUser((prev) => ({
      ...prev,
      status,
      lastActive: status === "online" ? "just now" : prev.lastActive,
    }));
  };

  const presenceCopy = getPresenceText(currentUser);

  return (
    <section className={styles.wrapper}>
      <UserCard user={currentUser} />
      <div className={styles.controls}>
        <div className={styles.controlsHeader}>
          <p className={styles.label}>Presence Controls</p>
          <p className={styles.caption}>Simulate how user status flows through UI slices.</p>
        </div>
        <div className={styles.buttons}>
          {statusOptions.map((option) => {
            const isActive = option.value === currentUser.status;
            return (
              <button
                key={option.value}
                type="button"
                className={`${styles.button} ${isActive ? styles.active : ""}`}
                onClick={() => handleStatusChange(option.value)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <p className={styles.note}>{presenceCopy}</p>
      </div>
    </section>
  );
}
