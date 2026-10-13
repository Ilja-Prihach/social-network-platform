'use client';

import type { UserRow } from '@/features/users-list/lib/mapUserToRow';
import type {
  UsersSortBy,
  UsersSortDirection,
} from '@/features/users-list/model/useUsersListQueryState';
import styles from '@/features/users-list/ui/UsersList.module.scss';
import { UsersListTableHeader } from './UsersListTableHeader';
import { UsersListTableRow } from './UsersListTableRow';

type UsersListTableProps = {
  users: UserRow[];
  isLoading: boolean;
  error: string | null;
  sortBy: UsersSortBy;
  sortDirection: UsersSortDirection;
  activeMenuUserId: number | null;
  onSortChange: (sortBy: UsersSortBy) => void;
  onToggleMenu: (userId: number) => void;
  onDelete: (user: UserRow) => void;
  onBan: (user: UserRow) => void;
  onUnban: (user: UserRow) => void;
  onMoreInformation: (userId: number) => void;
};

export function UsersListTable({
  users,
  isLoading,
  error,
  sortBy,
  sortDirection,
  activeMenuUserId,
  onSortChange,
  onToggleMenu,
  onDelete,
  onBan,
  onUnban,
  onMoreInformation,
}: UsersListTableProps) {
  return (
    <section className={styles.table_card}>
      <table className={styles.table}>
        <UsersListTableHeader
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortChange={onSortChange}
        />

        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className={styles.status_cell}>
                Loading...
              </td>
            </tr>
          ) : null}

          {!isLoading && error ? (
            <tr>
              <td colSpan={5} className={styles.status_cell}>
                {error}
              </td>
            </tr>
          ) : null}

          {!isLoading && !error && users.length === 0 ? (
            <tr>
              <td colSpan={5} className={styles.status_cell}>
                No users found
              </td>
            </tr>
          ) : null}

          {!isLoading && !error
            ? users.map((user) => (
                <UsersListTableRow
                  key={user.id}
                  user={user}
                  isMenuOpen={activeMenuUserId === user.id}
                  onToggleMenu={onToggleMenu}
                  onDelete={onDelete}
                  onBan={onBan}
                  onUnban={onUnban}
                  onMoreInformation={onMoreInformation}
                />
              ))
            : null}
        </tbody>
      </table>
    </section>
  );
}
