'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Select } from '@i18n-ui/select';
import { useLocale } from 'next-intlayer';
import {
  banUser,
  getUsersList,
  removeUser,
  unbanUser,
  type UsersListItem,
  type UsersListPagination,
} from '@/features/users-list';
import type { AdminCredentials } from '@/shared/apollo';
import { getAdminCredentials } from '@/shared/lib/adminAuthStorage';
import styles from './UsersListPage.module.scss';

type UserRow = {
  id: number;
  username: string;
  profileLink: string;
  dateAdded: string;
  blocked: boolean;
};
type DialogState =
  | { type: 'ban'; user: UserRow }
  | { type: 'unban'; user: UserRow }
  | { type: 'delete'; user: UserRow }
  | null;

type PageSizeOption = '8' | '16' | '24' | '50';
type StatusFilterOption = 'ALL' | 'BLOCKED' | 'UNBLOCKED';
type BanReasonOption = 'Bad behavior' | 'Advertising placement' | 'Another reason';
type UsersSortBy = 'createdAt' | 'userName';
type UsersSortDirection = 'asc' | 'desc';

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
const BAN_REASON_OPTIONS: Array<{ title: BanReasonOption; value: BanReasonOption }> = [
  { title: 'Bad behavior', value: 'Bad behavior' },
  { title: 'Advertising placement', value: 'Advertising placement' },
  { title: 'Another reason', value: 'Another reason' },
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

const resolveBanReason = (reason: BanReasonOption, customReason: string) => {
  if (reason !== 'Another reason') {
    return reason;
  }

  return customReason.trim();
};

const loadUsersPage = async (params: {
  credentials: AdminCredentials;
  currentPage: number;
  pageSize: PageSizeOption;
  searchTerm: string | null;
  statusFilter: StatusFilterOption;
  sortBy: UsersSortBy;
  sortDirection: UsersSortDirection;
}) => {
  return getUsersList(params.credentials, {
    pageNumber: params.currentPage,
    pageSize: Number(params.pageSize),
    searchTerm: params.searchTerm,
    statusFilter: params.statusFilter,
    sortBy: params.sortBy,
    sortDirection: params.sortDirection,
  });
};

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

const DeleteUserIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.menu_icon}>
    <path
      d="M21 6H17C16.7348 6 16.4804 6.10536 16.2929 6.29289C16.1054 6.48043 16 6.73478 16 7C16 7.26522 16.1054 7.51957 16.2929 7.70711C16.4804 7.89464 16.7348 8 17 8H21C21.2652 8 21.5196 7.89464 21.7071 7.70711C21.8946 7.51957 22 7.26522 22 7C22 6.73478 21.8946 6.48043 21.7071 6.29289C21.5196 6.10536 21.2652 6 21 6Z"
      fill="currentColor"
    />
    <path
      d="M10 11C10.7911 11 11.5645 10.7654 12.2223 10.3259C12.8801 9.88635 13.3928 9.26164 13.6955 8.53074C13.9983 7.79983 14.0775 6.99556 13.9231 6.21964C13.7688 5.44372 13.3878 4.73098 12.8284 4.17157C12.269 3.61216 11.5563 3.2312 10.7804 3.07686C10.0044 2.92252 9.20017 3.00173 8.46927 3.30448C7.73836 3.60723 7.11365 4.11992 6.67412 4.77772C6.2346 5.43552 6 6.20888 6 7C6 8.06087 6.42143 9.07828 7.17157 9.82843C7.92172 10.5786 8.93913 11 10 11ZM10 5C10.3956 5 10.7822 5.1173 11.1111 5.33706C11.44 5.55683 11.6964 5.86918 11.8478 6.23463C11.9991 6.60009 12.0387 7.00222 11.9616 7.39018C11.8844 7.77814 11.694 8.13451 11.4142 8.41421C11.1345 8.69392 10.7781 8.8844 10.3902 8.96157C10.0022 9.03874 9.60008 8.99913 9.23463 8.84776C8.86918 8.69639 8.55683 8.44004 8.33706 8.11114C8.1173 7.78224 8 7.39556 8 7C8 6.46957 8.21071 5.96086 8.58579 5.58579C8.96086 5.21071 9.46957 5 10 5Z"
      fill="currentColor"
    />
    <path
      d="M10 13C8.14348 13.0021 6.36361 13.7406 5.05079 15.0534C3.73797 16.3662 2.99947 18.1461 2.99738 20.0026C2.99738 20.2676 3.10266 20.5218 3.29013 20.7093C3.4776 20.8967 3.73186 21.002 3.99685 21.002H16C16.2652 21.002 16.5196 20.8967 16.7071 20.7092C16.8946 20.5216 17 20.2672 17 20.002C17 18.145 16.2625 16.3642 14.9495 15.0501C13.6366 13.736 11.8565 12.9968 10 12.993V13ZM5.17697 19C5.41574 17.8597 6.03911 16.836 6.94274 16.1014C7.84637 15.3669 8.97605 14.966 10.1405 14.966C11.305 14.966 12.4346 15.3669 13.3383 16.1014C14.2419 16.836 14.8653 17.8597 15.1041 19H5.17697Z"
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

const SortChevronIcon = ({
  direction,
  isActive,
}: {
  direction: UsersSortDirection;
  isActive: boolean;
}) => (
  <svg
    viewBox="0 0 16 16"
    aria-hidden="true"
    className={`${styles.sort_icon} ${isActive ? styles.sort_icon_active : ''} ${
      direction === 'asc' ? styles.sort_icon_asc : ''
    }`}
  >
    <path
      d="M4 6L8 10L12 6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);

export function UsersListPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [pagination, setPagination] = useState<UsersListPagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSizeOption>(DEFAULT_PAGE_SIZE);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilterOption>('ALL');
  const [sortBy, setSortBy] = useState<UsersSortBy>('createdAt');
  const [sortDirection, setSortDirection] = useState<UsersSortDirection>('desc');
  const [activeMenuUserId, setActiveMenuUserId] = useState<number | null>(null);
  const [dialogState, setDialogState] = useState<DialogState>(null);
  const [banReason, setBanReason] = useState<BanReasonOption>('Bad behavior');
  const [customBanReason, setCustomBanReason] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [isActionSubmitting, setIsActionSubmitting] = useState(false);
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
        const result = await loadUsersPage({
          credentials,
          currentPage,
          pageSize,
          searchTerm,
          statusFilter,
          sortBy,
          sortDirection,
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
  }, [currentPage, pageSize, searchTerm, sortBy, sortDirection, statusFilter]);

  const totalPages = pagination?.pagesCount ?? 0;
  const visiblePages = buildVisiblePages(currentPage, totalPages);
  const hasPreviousPage = pagination !== null && pagination.page > 1;
  const hasNextPage = pagination !== null && pagination.page < pagination.pagesCount;
  const currentBanReason = resolveBanReason(banReason, customBanReason);
  const isBanReasonInvalid = banReason === 'Another reason' && currentBanReason.trim() === '';
  const toggleSort = (nextSortBy: UsersSortBy) => {
    setCurrentPage(1);

    if (sortBy === nextSortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      return;
    }

    setSortBy(nextSortBy);
    setSortDirection(nextSortBy === 'userName' ? 'asc' : 'desc');
  };

  const openDialog = (dialog: Exclude<DialogState, null>) => {
    setActionError(null);
    setActiveMenuUserId(null);
    setDialogState(dialog);
    setBanReason('Bad behavior');
    setCustomBanReason('');
  };

  const closeDialog = () => {
    if (isActionSubmitting) return;

    setActionError(null);
    setDialogState(null);
    setBanReason('Bad behavior');
    setCustomBanReason('');
  };

  const handleOpenUserDetails = (userId: number) => {
    setActiveMenuUserId(null);
    router.push(`/${locale}/users/${userId}`);
  };

  const handleConfirmAction = async () => {
    if (!dialogState) return;

    const credentials = getAdminCredentials();

    if (!credentials) {
      setActionError('Admin credentials not found');
      return;
    }

    try {
      setIsActionSubmitting(true);
      setActionError(null);

      if (dialogState.type === 'ban') {
        if (isBanReasonInvalid) {
          setActionError('Please provide a reason');
          return;
        }

        await banUser(credentials, {
          userId: dialogState.user.id,
          banReason: currentBanReason,
        });
      }

      if (dialogState.type === 'unban') {
        await unbanUser(credentials, { userId: dialogState.user.id });
      }

      if (dialogState.type === 'delete') {
        await removeUser(credentials, { userId: dialogState.user.id });
      }

      const result = await loadUsersPage({
        credentials,
        currentPage,
        pageSize,
        searchTerm,
        statusFilter,
        sortBy,
        sortDirection,
      });

      setUsers(mapUsers(result.users));
      setPagination(result.pagination);
      setDialogState(null);
      setBanReason('Bad behavior');
      setCustomBanReason('');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setIsActionSubmitting(false);
    }
  };

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

        <div className={styles.toolbar_controls}>
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
        </div>
      </section>

      <section className={styles.table_card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Profile link</th>
              <th
                aria-sort={
                  sortBy === 'userName'
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                }
              >
                <button
                  type="button"
                  className={`${styles.sort_button} ${sortBy === 'userName' ? styles.sort_button_active : ''}`}
                  onClick={() => toggleSort('userName')}
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
                  sortBy === 'createdAt'
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                }
              >
                <button
                  type="button"
                  className={`${styles.sort_button} ${sortBy === 'createdAt' ? styles.sort_button_active : ''}`}
                  onClick={() => toggleSort('createdAt')}
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
                      <button
                        type="button"
                        className={styles.icon_button}
                        aria-label="Open row actions"
                        onClick={() =>
                          setActiveMenuUserId((value) => (value === user.id ? null : user.id))
                        }
                      >
                        <DotsIcon />
                      </button>
                      {activeMenuUserId === user.id ? (
                        <div className={styles.row_menu}>
                          <button
                            type="button"
                            className={styles.row_menu_item}
                            onClick={() => openDialog({ type: 'delete', user })}
                          >
                            <DeleteUserIcon />
                            Delete user
                          </button>
                          {user.blocked ? (
                            <button
                              type="button"
                              className={styles.row_menu_item}
                              onClick={() => openDialog({ type: 'unban', user })}
                            >
                              <BanIcon />
                              Un-ban user
                            </button>
                          ) : (
                            <button
                              type="button"
                              className={styles.row_menu_item}
                              onClick={() => openDialog({ type: 'ban', user })}
                            >
                              <BanIcon />
                              Ban in the system
                            </button>
                          )}
                          <button
                            type="button"
                            className={styles.row_menu_item}
                            onClick={() => handleOpenUserDetails(user.id)}
                          >
                            <DotsIcon />
                            More information
                          </button>
                        </div>
                      ) : null}
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

      {dialogState ? (
        <div className={styles.dialog_overlay} onClick={closeDialog}>
          <div className={styles.dialog} onClick={(event) => event.stopPropagation()}>
            <h2 className={styles.dialog_title}>
              {dialogState.type === 'ban' ? 'Ban user' : null}
              {dialogState.type === 'unban' ? 'Unban user' : null}
              {dialogState.type === 'delete' ? 'Delete user' : null}
            </h2>

            <p className={styles.dialog_description}>
              {dialogState.type === 'ban'
                ? `Are you sure you want to ban ${dialogState.user.username}?`
                : null}
              {dialogState.type === 'unban'
                ? `Are you sure you want to unban ${dialogState.user.username}?`
                : null}
              {dialogState.type === 'delete'
                ? `Are you sure you want to delete ${dialogState.user.username}?`
                : null}
            </p>

            {dialogState.type === 'ban' ? (
              <div className={styles.dialog_form}>
                <Select
                  className={styles.dialog_select}
                  options={BAN_REASON_OPTIONS}
                  value={banReason}
                  disabled={isActionSubmitting}
                  onChange={setBanReason}
                />

                {banReason === 'Another reason' ? (
                  <label className={styles.dialog_input}>
                    <span>Custom reason</span>
                    <input
                      type="text"
                      value={customBanReason}
                      onChange={(event) => setCustomBanReason(event.target.value)}
                      disabled={isActionSubmitting}
                    />
                  </label>
                ) : null}
              </div>
            ) : null}

            {actionError ? <p className={styles.dialog_error}>{actionError}</p> : null}

            <div className={styles.dialog_actions}>
              <button
                type="button"
                className={styles.dialog_button_secondary}
                onClick={closeDialog}
                disabled={isActionSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.dialog_button_primary}
                onClick={handleConfirmAction}
                disabled={isActionSubmitting || isBanReasonInvalid}
              >
                {isActionSubmitting ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
