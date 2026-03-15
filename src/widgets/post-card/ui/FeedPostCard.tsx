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
  const { post, author, likesCount, isLiked } = vm;

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

      <div className={s.actions}>
        <div className={s.actions_left}>
          <button type="button" className={s.icon_button} aria-label="Like post">
            <Icon iconId={isLiked ? 'heart' : 'heart-outline'} />
          </button>
          <button type="button" className={s.icon_button} aria-label="View comments">
            <Icon iconId="message-circle-outline" />
          </button>
          <button type="button" className={s.icon_button} aria-label="Share post">
            <Icon iconId="paper-plane-outline" />
          </button>
        </div>

        <button type="button" className={s.icon_button} aria-label="Save post">
          <Icon iconId="bookmark-outline" />
        </button>
      </div>

      <div className={s.body}>
        <p className={s.text}>
          <span className={s.username}>{author.username}</span>
          {post.text ? ` ${post.text}` : ''}
        </p>

        {typeof likesCount === 'number' && (
          <p className={s.likes}>
            {new Intl.NumberFormat().format(likesCount)} <span className={s.likes_label}>Like</span>
          </p>
        )}

        <button type="button" className={s.comments_link}>
          View All Comments
        </button>
      </div>

      <div className={s.comment_box}>
        <input className={s.comment_input} type="text" placeholder="Add a Comment..." />
        <button type="button" className={s.publish_button}>
          Publish
        </button>
      </div>
    </article>
  );
}
