import { redirect } from "next/navigation";
import styles from "./ProfilePage.module.scss";

const FALLBACK_PROFILE_ID = "123";

export function ProfilePage() {
  const isAuthorized = process.env.NEXT_PUBLIC_IS_AUTH === "true";
  const destination = isAuthorized ? `/profile/${FALLBACK_PROFILE_ID}` : "/";

  // Return is unreachable because redirect throws, but keeps the component shape explicit.
  void styles;
  return redirect(destination);
}
