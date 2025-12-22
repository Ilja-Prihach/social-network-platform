export type UserRole = "admin" | "editor" | "viewer";

export type UserStatus = "online" | "idle" | "offline";

export type User = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastActive: string;
};
