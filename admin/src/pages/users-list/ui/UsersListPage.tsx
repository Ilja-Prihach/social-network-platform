'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intlayer';
import { UsersListActionDialog } from '@/features/users-list/ui/UsersListActionDialog';
import { UsersListToolbar } from '@/features/users-list/ui/UsersListToolbar';
import { useUsersListActions } from '@/features/users-list/model/useUsersListActions';
import { useUsersListData } from '@/features/users-list/model/useUsersListData';
import { useUsersListQueryState } from '@/features/users-list/model/useUsersListQueryState';
import { UsersListPagination } from './UsersListPagination';
import { UsersListTable } from './UsersListTable';
import styles from './UsersListPage.module.scss';

export function UsersListPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const queryState = useUsersListQueryState();
  const usersListData = useUsersListData(queryState.queryState);
  const usersListActions = useUsersListActions({
    onOpenUserDetails: (userId) => router.push(`/${locale}/users/${userId}`),
    onUsersChanged: usersListData.reloadUsers,
  });

  return (
    <main className={styles.page}>
      <UsersListToolbar
        isLoading={usersListData.isLoading}
        searchInput={queryState.searchInput}
        statusFilter={queryState.statusFilter}
        onSearchInputChange={queryState.handleSearchInputChange}
        onStatusFilterChange={queryState.handleStatusFilterChange}
      />

      <UsersListTable
        users={usersListData.users}
        isLoading={usersListData.isLoading}
        error={usersListData.error}
        sortBy={queryState.sortBy}
        sortDirection={queryState.sortDirection}
        activeMenuUserId={usersListActions.activeMenuUserId}
        onSortChange={queryState.handleSortChange}
        onToggleMenu={usersListActions.handleMenuToggle}
        onDelete={(user) => usersListActions.openDialog({ type: 'delete', user })}
        onBan={(user) => usersListActions.openDialog({ type: 'ban', user })}
        onUnban={(user) => usersListActions.openDialog({ type: 'unban', user })}
        onMoreInformation={usersListActions.handleOpenUserDetails}
      />

      <UsersListPagination
        pagination={usersListData.pagination}
        currentPage={queryState.currentPage}
        pageSize={queryState.pageSize}
        isLoading={usersListData.isLoading}
        onNextPage={queryState.handleNextPage}
        onPreviousPage={queryState.handlePreviousPage}
        onPageChange={queryState.handlePageChange}
        onPageSizeChange={queryState.handlePageSizeChange}
      />

      <UsersListActionDialog
        dialogState={usersListActions.dialogState}
        banReason={usersListActions.banReason}
        customBanReason={usersListActions.customBanReason}
        actionError={usersListActions.actionError}
        isActionSubmitting={usersListActions.isActionSubmitting}
        isBanReasonInvalid={usersListActions.isBanReasonInvalid}
        onClose={usersListActions.closeDialog}
        onConfirm={usersListActions.handleConfirmAction}
        onBanReasonChange={usersListActions.setBanReason}
        onCustomBanReasonChange={usersListActions.setCustomBanReason}
      />
    </main>
  );
}
