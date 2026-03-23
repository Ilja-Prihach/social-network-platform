import styles from './SettingsStubPage.module.scss';

type SettingsStubPageProps = {
  title: string;
  description: string;
};

export function SettingsStubPage({ title, description }: SettingsStubPageProps) {
  return (
    <section className={styles.stub}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
    </section>
  );
}
