import { Icon } from '@/shared/ui/Icon';
import type { PostActionMenuItem } from '@/features/post/post-actions';
import styles from './PostViewerHeaderActions.module.scss';

type PostViewerHeaderActionsProps = {
  isEditMode: boolean;
  isActionPending: boolean;
  isMenuOpen: boolean;
  menuItems: PostActionMenuItem[];
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onRequestExitEditMode: () => void;
};

export function PostViewerHeaderActions({
  isEditMode,
  isActionPending,
  isMenuOpen,
  menuItems,
  onToggleMenu,
  onCloseMenu,
  onRequestExitEditMode,
}: PostViewerHeaderActionsProps) {
  if (isEditMode) {
    return (
      <div className={styles.header_actions}>
        <button
          type="button"
          className={styles.icon_button}
          aria-label="Exit edit mode"
          onClick={onRequestExitEditMode}
        >
          <Icon iconId="close-outline" />
        </button>
      </div>
    );
  }

  return (
    <div className={styles.header_actions}>
      <button
        type="button"
        className={styles.icon_button}
        aria-label="Open post actions"
        onClick={onToggleMenu}
      >
        <Icon iconId="more-horizontal-outline" />
      </button>

      {isMenuOpen && (
        <div className={styles.post_menu}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={styles.post_menu_item}
              onClick={() => {
                onCloseMenu();
                item.onClick?.();
              }}
              disabled={isActionPending}
            >
              <Icon iconId={item.iconId} className={styles.post_menu_icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
