import { Icon } from '@/shared/ui/Icon';
import { UserBadge } from '@/entities/user';
import { PostMediaCarousel } from '@/entities/post/ui/PostMediaCarousel';
import type { PostCardVM } from '../model/types';
import s from './FeedPostCard.module.scss';

type Props = {
  vm: PostCardVM;
  onOpen?: () => void;
  onHover?: () => void;
  profileHref?: string;
};

export function FeedPostCard({ vm, onOpen, onHover, profileHref }: Props) {
  const { post, author } = vm;

  return (
    <article className={s.card}>
      <header className={s.header}>
        <UserBadge user={author} createdAt={post.createdAt} profileHref={profileHref} />
        <button type="button" className={s.more_button} aria-label="More actions">
          <Icon iconId="more-horizontal-outline" />
        </button>
      </header>

      <div
        role={onOpen ? 'button' : undefined}
        tabIndex={onOpen ? 0 : undefined}
        className={`${s.media} ${onOpen ? s.media_open : ''}`}
        onClick={onOpen}
        onMouseEnter={onHover}
        onFocus={onHover}
        onKeyDown={(event) => {
          if (!onOpen) return;
          if (event.key === 'Enter' || event.key === ' ') {
            onOpen();
          }
        }}
      >
        <PostMediaCarousel media={post.media} variant="feed" />
      </div>

      <div className={s.body}>
        <p className={s.text}>
          <span className={s.username}>{author.username}</span>
          {post.text ? ` ${post.text}` : ''}
        </p>
      </div>
    </article>
  );
}
