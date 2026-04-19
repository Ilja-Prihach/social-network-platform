'use client';

import type { UserRow } from '../lib/mapUserToRow';
import { BanIcon, DeleteUserIcon, DotsIcon } from './UsersListIcons';
import styles from './UsersList.module.scss';

type UsersListRowMenuProps = {
  user: UserRow;
  onDelete: (user: UserRow) => void;
  onBan: (user: UserRow) => void;
  onUnban: (user: UserRow) => void;
  onMoreInformation: (userId: number) => void;
};

export function UsersListRowMenu({
  user,
  onDelete,
  onBan,
  onUnban,
  onMoreInformation,
}: UsersListRowMenuProps) {
  return (
    <div className={styles.row_menu}>
      <button type="button" className={styles.row_menu_item} onClick={() => onDelete(user)}>
        <DeleteUserIcon />
        Delete user
      </button>

      {user.blocked ? (
        <button type="button" className={styles.row_menu_item} onClick={() => onUnban(user)}>
          <BanIcon />
          Un-ban user
        </button>
      ) : (
        <button type="button" className={styles.row_menu_item} onClick={() => onBan(user)}>
          <BanIcon />
          Ban in the system
        </button>
      )}

      <button
        type="button"
        className={styles.row_menu_item}
        onClick={() => onMoreInformation(user.id)}
      >
        <DotsIcon />
        More information
      </button>
    </div>
  );
}
