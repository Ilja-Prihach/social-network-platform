import styles from "./ExampleEntityCard.module.scss";

import { formatExampleEntity } from "../lib/formatExampleEntity";
import type { ExampleEntity } from "../model/types";

type ExampleEntityCardProps = {
  entity?: ExampleEntity;
};

const defaultEntity: ExampleEntity = {
  id: "demo-1",
  name: "Example Entity",
  status: "active",
  updatedAt: "2024-05-01",
};

export function ExampleEntityCard({ entity = defaultEntity }: ExampleEntityCardProps) {
  const meta = formatExampleEntity(entity);

  return (
    <article className={styles.card}>
      <p className={styles.label}>Entity Stub</p>
      <div className={styles.titleRow}>
        <h3 className={styles.title}>{entity.name}</h3>
        <span className={styles.status}>{entity.status}</span>
      </div>
      <p className={styles.meta}>{meta}</p>
    </article>
  );
}
