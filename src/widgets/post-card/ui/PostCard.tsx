import type { PostCardVM } from '../model/types';
import { UserBadge } from '@/entities/user';
import { PostText } from '@/features/post/toggle-text';
import { PostMediaCarousel } from '@/entities/post/ui/PostMediaCarousel';
import s from './PostCard.module.scss';

type Props = {
  vm: PostCardVM;
  onOpen?: () => void;
};

export function PostCard({ vm, onOpen }: Props) {
  const { post, author } = vm;

  return (
    <article className={s.card}>
      <div
        role={onOpen ? 'button' : undefined}
        tabIndex={onOpen ? 0 : undefined}
        className={`${s.media} ${onOpen ? s.media_open : ''}`}
        onClick={onOpen}
        onKeyDown={(event) => {
          if (!onOpen) return;
          if (event.key === 'Enter' || event.key === ' ') {
            onOpen();
          }
        }}
      >
        <PostMediaCarousel media={post.media} />
      </div>

      <header className={s.header}>
        <UserBadge user={author} createdAt={post.createdAt} />
      </header>

      <div className={s.body}>
        <PostText text={post.text} />
      </div>
    </article>
  );
}
