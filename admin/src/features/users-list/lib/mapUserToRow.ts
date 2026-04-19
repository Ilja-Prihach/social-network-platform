import type { UsersListItem } from '../model/getUsersList';

export type UserRow = {
  id: number;
  username: string;
  profileLink: string;
  dateAdded: string;
  blocked: boolean;
};

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('ru-RU').format(date);
};

export const mapUserToRow = (item: UsersListItem): UserRow => ({
  id: item.id,
  username: item.userName,
  profileLink: item.userName,
  dateAdded: formatDate(item.createdAt),
  blocked: item.userBan !== null,
});

export const mapUsersToRows = (items: UsersListItem[]) => items.map(mapUserToRow);
