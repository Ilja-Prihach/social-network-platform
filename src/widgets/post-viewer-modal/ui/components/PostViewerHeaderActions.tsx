import { Icon } from '@/shared/ui/Icon';
import type { PostActionMenuItem } from '@/features/post/post-actions';
import styles from './PostViewerHeaderActions.module.scss';

type PostViewerHeaderActionsProps = {
  isAuthPending?: boolean;
  isEditMode: boolean;
  isActionPending: boolean;
  isMenuOpen: boolean;
  menuItems: PostActionMenuItem[];
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onRequestExitEditMode: () => void;
  exitEditModeLabel: string;
  openPostActionsLabel: string;
};

export function PostViewerHeaderActions({
  isAuthPending,
  isEditMode,
  isActionPending,
  isMenuOpen,
  menuItems,
  onToggleMenu,
  onCloseMenu,
  onRequestExitEditMode,
  exitEditModeLabel,
  openPostActionsLabel,
}: PostViewerHeaderActionsProps) {
  if (isAuthPending) {
    return (
      <div className={styles.header_actions}>
        <div className={styles.actions_skeleton} aria-hidden />
      </div>
    );
  }

  if (isEditMode) {
    return (
      <div className={styles.header_actions}>
        <button
          type="button"
          className={styles.icon_button}
          aria-label={exitEditModeLabel}
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
        aria-label={openPostActionsLabel}
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
