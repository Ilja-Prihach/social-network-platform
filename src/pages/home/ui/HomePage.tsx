'use client';

import { useSearchParams } from 'next/navigation';
import styles from './HomePage.module.scss';
import { RegistrationConfirmationHandler } from '@/features/auth/registration-confirmation';
import { Sidebar } from '@/widgets/sidebar/ui/Sidebar';
import { mockPosts } from '@/entities/post';
import { mockUsers } from '@/entities/user';
import { buildPostCards, PostCard } from '@/widgets/post-card';
import { CounterPeople } from '@/widgets/counterPeople';

export function HomePage() {
  const searchParams = useSearchParams();
  const code = searchParams?.get('code') ?? undefined;
  const email = searchParams?.get('email') ?? undefined;
  const items = buildPostCards(mockPosts, mockUsers);

  return (
    <>
      <RegistrationConfirmationHandler code={code} email={email} />
      <section className={styles.page}>
        <div className={styles.content}>
          <aside className={styles.sidebar}>
            <Sidebar />
          </aside>
          <div className={styles.user_count}>
            <CounterPeople />
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
    </>
  );
}
