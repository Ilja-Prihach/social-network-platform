import 'server-only';

import { serverApi } from '@/shared/api/server/serverApi';
import { isApiError } from '@/shared/api/types';
import type { MeResponse } from './me';

export async function getMeServerSafe(): Promise<MeResponse | null> {
  try {
    return await serverApi<MeResponse>('/api/v1/auth/me');
  } catch (error) {
    if (isApiError(error) && error.status === 401) return null;
    throw error;
  }
}
