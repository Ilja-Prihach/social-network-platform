'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AdminCredentials } from '@/shared/apollo';
import { getAdminCredentials } from '@/shared/lib/adminAuthStorage';
import { mapUsersToRows, type UserRow } from '../lib/mapUserToRow';
import { getUsersList, type UsersListPagination } from './getUsersList';
import type { UsersListQueryState } from './useUsersListQueryState';

export const useUsersListData = (queryState: UsersListQueryState) => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [pagination, setPagination] = useState<UsersListPagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reloadUsers = useCallback(
    async (credentials: AdminCredentials | null = getAdminCredentials()) => {
      if (!credentials) {
        setError('Admin credentials not found');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const result = await getUsersList(credentials, {
          pageNumber: queryState.currentPage,
          pageSize: Number(queryState.pageSize),
          searchTerm: queryState.searchTerm,
          statusFilter: queryState.statusFilter,
          sortBy: queryState.sortBy,
          sortDirection: queryState.sortDirection,
        });

        setUsers(mapUsersToRows(result.users));
        setPagination(result.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load users');
      } finally {
        setIsLoading(false);
      }
    },
    [
      queryState.currentPage,
      queryState.pageSize,
      queryState.searchTerm,
      queryState.sortBy,
      queryState.sortDirection,
      queryState.statusFilter,
    ],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void reloadUsers();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [reloadUsers]);

  return {
    users,
    pagination,
    isLoading,
    error,
    reloadUsers,
  };
};
