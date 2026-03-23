import type { AdminCredentials } from '@/shared/apollo';
import { ADMIN_CREDENTIALS_STORAGE_KEY } from '@/shared/constants/adminAuth';

export const saveAdminCredentials = (credentials: AdminCredentials) => {
  window.sessionStorage.setItem(ADMIN_CREDENTIALS_STORAGE_KEY, JSON.stringify(credentials));
};

export const getAdminCredentials = (): AdminCredentials | null => {
  const rawValue = window.sessionStorage.getItem(ADMIN_CREDENTIALS_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<AdminCredentials>;

    if (typeof parsed.email !== 'string' || typeof parsed.password !== 'string') {
      return null;
    }

    return {
      email: parsed.email,
      password: parsed.password,
    };
  } catch {
    return null;
  }
};

export const hasAdminCredentials = () => {
  return getAdminCredentials() !== null;
};
