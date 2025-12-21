import { formatUserStatus } from "@/entities/user";
import type { User } from "@/entities/user";

export function getPresenceText(user: User) {
  return formatUserStatus(user);
}
