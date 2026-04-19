'use client';

import { useEffect, useState } from 'react';
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

const PAGE_SIZE = 8;

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

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.chevron_icon}>
    <path
      d="M5.51416 9.45842C5.5137 9.22477 5.59508 8.99834 5.74416 8.81842C5.82811 8.71717 5.93121 8.63346 6.04756 8.57211C6.1639 8.51076 6.29121 8.47296 6.42219 8.46089C6.55316 8.44881 6.68524 8.46269 6.81084 8.50174C6.93644 8.54078 7.05311 8.60422 7.15416 8.68842L12.5142 13.1684L17.8842 8.84843C17.9864 8.76536 18.1041 8.70333 18.2305 8.6659C18.3568 8.62846 18.4893 8.61637 18.6203 8.63031C18.7514 8.64425 18.8784 8.68395 18.994 8.74712C19.1096 8.81029 19.2116 8.8957 19.2942 8.99843C19.3852 9.10189 19.4539 9.22306 19.4959 9.35432C19.5378 9.48558 19.5522 9.62411 19.5382 9.7612C19.5241 9.89829 19.4818 10.031 19.414 10.151C19.3462 10.271 19.2543 10.3756 19.1442 10.4584L13.1442 15.2884C12.9652 15.4355 12.7408 15.5159 12.5092 15.5159C12.2775 15.5159 12.0531 15.4355 11.8742 15.2884L5.87416 10.2884C5.75314 10.1881 5.65748 10.0607 5.59493 9.91646C5.53238 9.77225 5.50471 9.61533 5.51416 9.45842Z"
      fill="currentColor"
    />
  </svg>
);

export function UsersListPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [pagination, setPagination] = useState<UsersListPagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          pageSize: PAGE_SIZE,
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
  }, [currentPage]);

  const totalPages = pagination?.pagesCount ?? 0;
  const visiblePages = buildVisiblePages(currentPage, totalPages);
  const hasPreviousPage = pagination !== null && pagination.page > 1;
  const hasNextPage = pagination !== null && pagination.page < pagination.pagesCount;

  return (
    <main className={styles.page}>
      <section className={styles.toolbar}>
        <label className={styles.search}>
          <SearchIcon />
          <input type="text" placeholder="Search" disabled />
        </label>

        <button className={styles.filter} type="button">
          <span>Not selected</span>
          <ChevronDownIcon />
        </button>
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
          <button type="button" className={styles.page_size_select}>
            <span>{pagination?.pageSize ?? PAGE_SIZE}</span>
            <ChevronDownIcon />
          </button>
          <span>on page</span>
        </div>
      </section>
    </main>
  );
}
