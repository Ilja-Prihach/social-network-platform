import type { User, UserStatus } from "../model/types";

const statusLabels: Record<UserStatus, string> = {
  online: "Online",
  idle: "Idle",
  offline: "Offline",
};

export function formatUserStatus(user: User) {
  const statusLabel = statusLabels[user.status] ?? statusLabels.offline;
  const lastActiveCopy =
    user.status === "online" ? "Active now" : `Last active ${user.lastActive}`;

  return `${statusLabel} • ${lastActiveCopy}`;
}
