export type UserRole = 'admin' | 'editor' | 'viewer';

export type UserStatus = 'online' | 'idle' | 'offline';

export type User = {
  id: string;
  username: string;
  avatarUrl?: string;
};
