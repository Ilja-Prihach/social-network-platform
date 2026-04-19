'use client';

import { useEffect, useState } from 'react';

export type PageSizeOption = '8' | '16' | '24' | '50';
export type StatusFilterOption = 'ALL' | 'BLOCKED' | 'UNBLOCKED';
export type UsersSortBy = 'createdAt' | 'userName';
export type UsersSortDirection = 'asc' | 'desc';

export type UsersListQueryState = {
  currentPage: number;
  pageSize: PageSizeOption;
  searchTerm: string | null;
  statusFilter: StatusFilterOption;
  sortBy: UsersSortBy;
  sortDirection: UsersSortDirection;
};

export const DEFAULT_PAGE_SIZE: PageSizeOption = '8';
export const PAGE_SIZE_OPTIONS: Array<{ title: string; value: PageSizeOption }> = [
  { title: '8', value: '8' },
  { title: '16', value: '16' },
  { title: '24', value: '24' },
  { title: '50', value: '50' },
];
export const STATUS_FILTER_OPTIONS: Array<{ title: string; value: StatusFilterOption }> = [
  { title: 'Not selected', value: 'ALL' },
  { title: 'Blocked', value: 'BLOCKED' },
  { title: 'Not Blocked', value: 'UNBLOCKED' },
];

const SEARCH_DEBOUNCE_MS = 300;

export const useUsersListQueryState = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSizeOption>(DEFAULT_PAGE_SIZE);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilterOption>('ALL');
  const [sortBy, setSortBy] = useState<UsersSortBy>('createdAt');
  const [sortDirection, setSortDirection] = useState<UsersSortDirection>('desc');

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const nextSearchTerm = searchInput.trim() === '' ? null : searchInput.trim();

      setCurrentPage(1);
      setSearchTerm(nextSearchTerm);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  const handleStatusFilterChange = (value: StatusFilterOption) => {
    setCurrentPage(1);
    setStatusFilter(value);
  };

  const handlePageSizeChange = (value: PageSizeOption) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  const handleSortChange = (nextSortBy: UsersSortBy) => {
    setCurrentPage(1);

    if (sortBy === nextSortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      return;
    }

    setSortBy(nextSortBy);
    setSortDirection(nextSortBy === 'userName' ? 'asc' : 'desc');
  };

  return {
    queryState: {
      currentPage,
      pageSize,
      searchTerm,
      statusFilter,
      sortBy,
      sortDirection,
    } satisfies UsersListQueryState,
    currentPage,
    pageSize,
    searchInput,
    statusFilter,
    sortBy,
    sortDirection,
    handlePageChange: setCurrentPage,
    handleNextPage: () => setCurrentPage((page) => page + 1),
    handlePreviousPage: () => setCurrentPage((page) => Math.max(1, page - 1)),
    handlePageSizeChange,
    handleSearchInputChange: setSearchInput,
    handleStatusFilterChange,
    handleSortChange,
  };
};
