'use client';

import { Select } from '@i18n-ui/select';
import { STATUS_FILTER_OPTIONS, type StatusFilterOption } from '../model/useUsersListQueryState';
import { SearchIcon } from './UsersListIcons';
import styles from './UsersList.module.scss';

type UsersListToolbarProps = {
  isLoading: boolean;
  searchInput: string;
  statusFilter: StatusFilterOption;
  onSearchInputChange: (value: string) => void;
  onStatusFilterChange: (value: StatusFilterOption) => void;
};

export function UsersListToolbar({
  isLoading,
  searchInput,
  statusFilter,
  onSearchInputChange,
  onStatusFilterChange,
}: UsersListToolbarProps) {
  return (
    <section className={styles.toolbar}>
      <label className={styles.search}>
        <SearchIcon />
        <input
          type="text"
          placeholder="Search"
          value={searchInput}
          onChange={(event) => onSearchInputChange(event.target.value)}
        />
      </label>

      <div className={styles.toolbar_controls}>
        <Select
          className={styles.filter}
          options={STATUS_FILTER_OPTIONS}
          value={statusFilter}
          disabled={isLoading}
          onChange={onStatusFilterChange}
        />
      </div>
    </section>
  );
}
