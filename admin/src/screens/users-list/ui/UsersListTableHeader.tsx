'use client';

import { SortChevronIcon } from '@/features/users-list/ui/UsersListIcons';
import type {
  UsersSortBy,
  UsersSortDirection,
} from '@/features/users-list/model/useUsersListQueryState';
import styles from '@/features/users-list/ui/UsersList.module.scss';

type UsersListTableHeaderProps = {
  sortBy: UsersSortBy;
  sortDirection: UsersSortDirection;
  onSortChange: (sortBy: UsersSortBy) => void;
};

export function UsersListTableHeader({
  sortBy,
  sortDirection,
  onSortChange,
}: UsersListTableHeaderProps) {
  return (
    <thead>
      <tr>
        <th>User ID</th>
        <th>Profile link</th>
        <th
          aria-sort={
            sortBy === 'userName' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'
          }
        >
          <button
            type="button"
            className={`${styles.sort_button} ${sortBy === 'userName' ? styles.sort_button_active : ''}`}
            onClick={() => onSortChange('userName')}
            aria-label={`Sort by username ${sortBy === 'userName' && sortDirection === 'asc' ? 'descending' : 'ascending'}`}
          >
            <span>Username</span>
            <SortChevronIcon
              direction={sortBy === 'userName' ? sortDirection : 'asc'}
              isActive={sortBy === 'userName'}
            />
          </button>
        </th>
        <th
          aria-sort={
            sortBy === 'createdAt' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'
          }
        >
          <button
            type="button"
            className={`${styles.sort_button} ${sortBy === 'createdAt' ? styles.sort_button_active : ''}`}
            onClick={() => onSortChange('createdAt')}
            aria-label={`Sort by date added ${sortBy === 'createdAt' && sortDirection === 'desc' ? 'ascending' : 'descending'}`}
          >
            <span>Date added</span>
            <SortChevronIcon
              direction={sortBy === 'createdAt' ? sortDirection : 'desc'}
              isActive={sortBy === 'createdAt'}
            />
          </button>
        </th>
        <th aria-label="Actions" />
      </tr>
    </thead>
  );
}
