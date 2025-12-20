import styles from "./ExampleFeature.module.scss";

import { getExampleMessage } from "../lib/getExampleMessage";
import type { ExampleFeatureProps } from "../model/types";

export function ExampleFeature({
  title = "Example Feature",
  description = "Plug this slice into a widget or page to prototype interactions.",
  tone = "informational",
}: ExampleFeatureProps) {
  const message = getExampleMessage(description, tone);

  return (
    <section className={styles.container}>
      <p className={styles.label}>Feature Slice Stub</p>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
    </section>
  );
}
