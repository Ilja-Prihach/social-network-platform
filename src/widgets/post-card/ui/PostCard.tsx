import type { PostCardVM } from '../model/types';
import { UserBadge } from '@/entities/user';
import { PostText } from '@/features/post/toggle-text';
import { PostMediaCarousel } from '@/entities/post/ui/PostMediaCarousel';
import s from './PostCard.module.scss';

type Props = {
  vm: PostCardVM;
};

export function PostCard({ vm }: Props) {
  const { post, author } = vm;

  return (
    <article className={s.card}>
      <div className={s.media}>
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
