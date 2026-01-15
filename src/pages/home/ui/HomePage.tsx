'use client';

import styles from './HomePage.module.scss';

import { Sidebar } from '@/widgets/sidebar/ui/Sidebar';
import { Header } from '@/widgets/header/ui/Header';

import { mockPosts } from '@/entities/post';
import { mockUsers } from '@/entities/user';
import { buildPostCards, PostCard } from '@/widgets/post-card';
import Counter from '@/shared/ui/Counter';

export function HomePage() {
  const items = buildPostCards(mockPosts, mockUsers);

  return (
    <section className={styles.page}>
      <Header />

      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <Sidebar />
        </aside>
        <div className={styles.user_count}>
          <Counter value={234} />
        </div>

        <main className={styles.main}>
          <div className={styles.grid}>
            {items.map((vm) => (
              <PostCard key={vm.post.id} vm={vm} />
            ))}
          </div>
        </main>
      </div>
    </section>
  );
}
