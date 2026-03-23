import type { AdminCredentials } from '@/shared/apollo';
import { ADMIN_CREDENTIALS_STORAGE_KEY } from '@/shared/constants/adminAuth';

export const saveAdminCredentials = (credentials: AdminCredentials) => {
  window.sessionStorage.setItem(ADMIN_CREDENTIALS_STORAGE_KEY, JSON.stringify(credentials));
};
