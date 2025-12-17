import { redirect } from "next/navigation";
import styles from "./SettingsPage.module.scss";

type SettingsPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

type SettingsPart = "info" | "devices" | "subscriptions" | "payments";

const normalizeParam = (value?: string | string[]): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

const isPartSupported = (value?: string): value is SettingsPart => {
  return value === "info" || value === "devices" || value === "subscriptions" || value === "payments";
};

export function SettingsPage({ searchParams = {} }: SettingsPageProps) {
  const rawPart = normalizeParam(searchParams.part);
  const normalizedPart: SettingsPart = isPartSupported(rawPart) ? rawPart : "info";

  if (!rawPart || rawPart !== normalizedPart) {
    redirect(`/settings?part=${normalizedPart}`);
  }

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Settings</h1>
      <p className={styles.description}>
        Active section: <span className={styles.accent}>{normalizedPart}</span>
      </p>
      <p className={styles.hint}>
        Stub settings page. Update the layout to display the selected settings slice
        (info, devices, subscriptions, payments) based on the query parameter.
      </p>
    </section>
  );
}
