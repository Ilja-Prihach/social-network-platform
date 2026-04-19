'use client';

import type { UserRow } from '@/features/users-list/lib/mapUserToRow';
import { BanIcon, DotsIcon } from '@/features/users-list/ui/UsersListIcons';
import { UsersListRowMenu } from '@/features/users-list/ui/UsersListRowMenu';
import styles from '@/features/users-list/ui/UsersList.module.scss';

type UsersListTableRowProps = {
  user: UserRow;
  isMenuOpen: boolean;
  onToggleMenu: (userId: number) => void;
  onDelete: (user: UserRow) => void;
  onBan: (user: UserRow) => void;
  onUnban: (user: UserRow) => void;
  onMoreInformation: (userId: number) => void;
};

export function UsersListTableRow({
  user,
  isMenuOpen,
  onToggleMenu,
  onDelete,
  onBan,
  onUnban,
  onMoreInformation,
}: UsersListTableRowProps) {
  return (
    <tr>
      <td>
        <div className={styles.user_id}>
          {user.blocked ? <BanIcon /> : null}
          <span>{user.id}</span>
        </div>
      </td>
      <td>{user.profileLink}</td>
      <td>{user.username}</td>
      <td>{user.dateAdded}</td>
      <td className={styles.actions}>
        <button
          type="button"
          className={styles.icon_button}
          aria-label="Open row actions"
          onClick={() => onToggleMenu(user.id)}
        >
          <DotsIcon />
        </button>

        {isMenuOpen ? (
          <UsersListRowMenu
            user={user}
            onDelete={onDelete}
            onBan={onBan}
            onUnban={onUnban}
            onMoreInformation={onMoreInformation}
          />
        ) : null}
      </td>
    </tr>
  );
}
