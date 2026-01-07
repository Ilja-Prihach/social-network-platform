import { BASE_API_URL } from '@/shared/api/baseApi';

export const recoverPassword = async (email: string): Promise<void> => {
  const response = await fetch(`${BASE_API_URL}/api/v1/auth/recover-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data?.errorsMessages?.[0]?.message || 'Recover Password');
  }
};
