import type { UserRole } from "../model/types";

const roleLabels: Record<UserRole, string> = {
  admin: "Administrator",
  editor: "Content Editor",
  viewer: "Viewer",
};

export function getUserRoleLabel(role: UserRole) {
  return roleLabels[role] ?? "Member";
}
