'use client';

import styles from './Sidebar.module.scss';
import { Button } from '@/shared/ui/Button/Button';

export const Sidebar = () => {
  return (
    <nav className={styles.sidebar}>
      <ul className={styles.sidebar_nav}>
        <li>
          <Button
            href="/feed"
            variant="text"
            style={{
              color: 'var(--light-100-color)',
            }}
          >
            <div className={styles.svg}></div>
            <span>Feed</span>
          </Button>
        </li>
        <li>
          <Button
            href="/create"
            variant="text"
            style={{
              color: 'var(--light-100-color)',
            }}
          >
            <div className={styles.svg}></div>
            <span>Create</span>
          </Button>
        </li>
        <li>
          <Button
            href="/my-profile"
            variant="text"
            style={{
              color: 'var(--light-100-color)',
            }}
          >
            <div className={styles.svg}></div>
            <span>My Profile</span>
          </Button>
        </li>
        <li>
          <Button
            href="/messenger"
            variant="text"
            style={{
              color: 'var(--light-100-color)',
            }}
          >
            <div className={styles.svg}></div>
            <span>Messanger</span>
          </Button>
        </li>
        <li>
          <Button
            href="/search"
            variant="text"
            style={{
              color: 'var(--light-100-color)',
            }}
          >
            <div className={styles.svg}></div>
            <span>Search</span>
          </Button>
        </li>
      </ul>

      <ul className={styles.sidebar_tools}>
        <li>
          <Button
            href="/statistics"
            variant="text"
            style={{
              color: 'var(--light-100-color)',
            }}
          >
            <div className={styles.svg}></div>
            <span>Statistics</span>
          </Button>
        </li>
        <li>
          <Button
            href="/favorites"
            variant="text"
            style={{
              color: 'var(--light-100-color)',
            }}
          >
            <div className={styles.svg}></div>
            <span>Favorites</span>
          </Button>
        </li>
      </ul>

      <ul className={styles.sidebar_logout}>
        <li>
          <Button
            href="/sign-in"
            variant="text"
            style={{
              color: 'var(--light-100-color)',
            }}
          >
            <div className={styles.svg}></div>
            <span>Log Out</span>
          </Button>
        </li>
      </ul>
    </nav>
  );
};
