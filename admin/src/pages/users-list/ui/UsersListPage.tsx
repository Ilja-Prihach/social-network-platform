'use client';

import { useEffect, useState } from 'react';
import { Select } from '@i18n-ui/select';
import { getUsersList, type UsersListItem, type UsersListPagination } from '@/features/users-list';
import { getAdminCredentials } from '@/shared/lib/adminAuthStorage';
import styles from './UsersListPage.module.scss';

type UserRow = {
  id: number;
  username: string;
  profileLink: string;
  dateAdded: string;
  blocked: boolean;
};

type PageSizeOption = '8' | '16' | '24' | '50';
type StatusFilterOption = 'ALL' | 'BLOCKED' | 'UNBLOCKED';

const DEFAULT_PAGE_SIZE: PageSizeOption = '8';
const PAGE_SIZE_OPTIONS: Array<{ title: string; value: PageSizeOption }> = [
  { title: '8', value: '8' },
  { title: '16', value: '16' },
  { title: '24', value: '24' },
  { title: '50', value: '50' },
];
const STATUS_FILTER_OPTIONS: Array<{ title: string; value: StatusFilterOption }> = [
  { title: 'Not selected', value: 'ALL' },
  { title: 'Blocked', value: 'BLOCKED' },
  { title: 'Not Blocked', value: 'UNBLOCKED' },
];

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('ru-RU').format(date);
};

const mapUsers = (items: UsersListItem[]): UserRow[] =>
  items.map((item) => ({
    id: item.id,
    username: item.userName,
    profileLink: item.userName,
    dateAdded: formatDate(item.createdAt),
    blocked: item.userBan !== null,
  }));

const buildVisiblePages = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', totalPages] as const;
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      'ellipsis',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ] as const;
  }

  return [
    1,
    'ellipsis',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'ellipsis',
    totalPages,
  ] as const;
};

const BanIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.ban_icon}>
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM4 12C4 7.59 7.59 4 12 4C13.85 4 15.56 4.63 16.92 5.69L5.69 16.92C4.63 15.56 4 13.85 4 12ZM12 20C10.15 20 8.44 19.37 7.08 18.31L18.31 7.08C19.37 8.44 20 10.15 20 12C20 16.41 16.41 20 12 20Z"
      fill="currentColor"
    />
  </svg>
);

const DotsIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.dots_icon}>
    <path
      d="M5 14C6.10457 14 7 13.1046 7 12C7 10.8954 6.10457 10 5 10C3.89543 10 3 10.8954 3 12C3 13.1046 3.89543 14 5 14Z"
      fill="currentColor"
    />
    <path
      d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
      fill="currentColor"
    />
    <path
      d="M19 14C20.1046 14 21 13.1046 21 12C21 10.8954 20.1046 10 19 10C17.8954 10 17 10.8954 17 12C17 13.1046 17.8954 14 19 14Z"
      fill="currentColor"
    />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.search_icon}>
    <path
      d="M20.71 19.29L17.31 15.9C18.407 14.5025 19.0022 12.7767 19 11C19 9.41775 18.5308 7.87103 17.6518 6.55544C16.7727 5.23985 15.5233 4.21447 14.0615 3.60897C12.5997 3.00347 10.9911 2.84504 9.43928 3.15372C7.88743 3.4624 6.46197 4.22433 5.34315 5.34315C4.22433 6.46197 3.4624 7.88743 3.15372 9.43928C2.84504 10.9911 3.00347 12.5997 3.60897 14.0615C4.21447 15.5233 5.23985 16.7727 6.55544 17.6518C7.87103 18.5308 9.41775 19 11 19C12.7767 19.0022 14.5025 18.407 15.9 17.31L19.29 20.71C19.383 20.8037 19.4936 20.8781 19.6154 20.9289C19.7373 20.9797 19.868 21.0058 20 21.0058C20.132 21.0058 20.2627 20.9797 20.3846 20.9289C20.5064 20.8781 20.617 20.8037 20.71 20.71C20.8037 20.617 20.8781 20.5064 20.9289 20.3846C20.9797 20.2627 21.0058 20.132 21.0058 20C21.0058 19.868 20.9797 19.7373 20.9289 19.6154C20.8781 19.4936 20.8037 19.383 20.71 19.29ZM5 11C5 9.81332 5.3519 8.65328 6.01118 7.66658C6.67047 6.67989 7.60755 5.91085 8.7039 5.45672C9.80026 5.0026 11.0067 4.88378 12.1705 5.11529C13.3344 5.3468 14.4035 5.91825 15.2426 6.75736C16.0818 7.59648 16.6532 8.66558 16.8847 9.82946C17.1162 10.9933 16.9974 12.1997 16.5433 13.2961C16.0892 14.3925 15.3201 15.3295 14.3334 15.9888C13.3467 16.6481 12.1867 17 11 17C9.4087 17 7.88258 16.3679 6.75736 15.2426C5.63214 14.1174 5 12.5913 5 11Z"
      fill="currentColor"
    />
  </svg>
);

export function UsersListPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [pagination, setPagination] = useState<UsersListPagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSizeOption>(DEFAULT_PAGE_SIZE);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilterOption>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const nextSearchTerm = searchInput.trim() === '' ? null : searchInput.trim();

      setCurrentPage(1);
      setSearchTerm(nextSearchTerm);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    const credentials = getAdminCredentials();

    if (!credentials) {
      setError('Admin credentials not found');
      setIsLoading(false);
      return;
    }

    const run = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getUsersList(credentials, {
          pageNumber: currentPage,
          pageSize: Number(pageSize),
          searchTerm,
          statusFilter,
        });

        setUsers(mapUsers(result.users));
        setPagination(result.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };

    void run();
  }, [currentPage, pageSize, searchTerm, statusFilter]);

  const totalPages = pagination?.pagesCount ?? 0;
  const visiblePages = buildVisiblePages(currentPage, totalPages);
  const hasPreviousPage = pagination !== null && pagination.page > 1;
  const hasNextPage = pagination !== null && pagination.page < pagination.pagesCount;

  return (
    <main className={styles.page}>
      <section className={styles.toolbar}>
        <label className={styles.search}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </label>

        <Select
          className={styles.filter}
          options={STATUS_FILTER_OPTIONS}
          value={statusFilter}
          disabled={isLoading}
          onChange={(value) => {
            setCurrentPage(1);
            setStatusFilter(value);
          }}
        />
      </section>

      <section className={styles.table_card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Profile link</th>
              <th>Username</th>
              <th>Date added</th>
              <th aria-label="Actions" />
            </tr>
          </thead>

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
                  <tr key={user.id}>
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
                      <button type="button" className={styles.icon_button} aria-label="Row actions">
                        <DotsIcon />
                      </button>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </section>

      <section className={styles.pagination}>
        <button
          type="button"
          className={styles.page_arrow}
          aria-label="Previous page"
          disabled={!hasPreviousPage || isLoading}
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
        >
          ‹
        </button>

        {visiblePages.map((page, index) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className={styles.page_dots}>
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={`${styles.page_button} ${page === currentPage ? styles.page_button_active : ''}`}
              disabled={isLoading}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          className={styles.page_arrow}
          aria-label="Next page"
          disabled={!hasNextPage || isLoading}
          onClick={() => setCurrentPage((page) => page + 1)}
        >
          ›
        </button>

        <div className={styles.page_size}>
          <span>Show</span>
          <Select
            className={styles.page_size_select}
            options={PAGE_SIZE_OPTIONS}
            value={pageSize}
            disabled={isLoading}
            onChange={(value) => {
              setCurrentPage(1);
              setPageSize(value);
            }}
          />
          <span>on page</span>
        </div>
      </section>
    </main>
  );
}
