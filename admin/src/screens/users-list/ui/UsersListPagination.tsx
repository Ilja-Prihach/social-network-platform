'use client';

import { Select } from '@i18n-ui/select';
import { buildVisiblePages } from '@/features/users-list/lib/buildVisiblePages';
import type { UsersListPagination } from '@/features/users-list/model/getUsersList';
import {
  PAGE_SIZE_OPTIONS,
  type PageSizeOption,
} from '@/features/users-list/model/useUsersListQueryState';
import styles from '@/features/users-list/ui/UsersList.module.scss';

type UsersListPaginationProps = {
  pagination: UsersListPagination | null;
  currentPage: number;
  pageSize: PageSizeOption;
  isLoading: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (value: PageSizeOption) => void;
};

export function UsersListPagination({
  pagination,
  currentPage,
  pageSize,
  isLoading,
  onNextPage,
  onPreviousPage,
  onPageChange,
  onPageSizeChange,
}: UsersListPaginationProps) {
  const totalPages = pagination?.pagesCount ?? 0;
  const visiblePages = buildVisiblePages(currentPage, totalPages);
  const hasPreviousPage = pagination !== null && pagination.page > 1;
  const hasNextPage = pagination !== null && pagination.page < pagination.pagesCount;

  return (
    <section className={styles.pagination}>
      <button
        type="button"
        className={styles.page_arrow}
        aria-label="Previous page"
        disabled={!hasPreviousPage || isLoading}
        onClick={onPreviousPage}
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
            onClick={() => onPageChange(page)}
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
        onClick={onNextPage}
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
          onChange={onPageSizeChange}
        />
        <span>on page</span>
      </div>
    </section>
  );
}
