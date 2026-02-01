import { BASE_URL } from '@/shared/api/baseApi';

type NewPasswordPayload = {
  newPassword: string;
  recoveryCode: string;
};

type ErrorResponse = {
  errorsMessages?: Array<{ message?: string }>;
};

const getErrorMessage = async (response: Response, fallback: string) => {
  try {
    const data = (await response.json()) as ErrorResponse;
    return data?.errorsMessages?.[0]?.message || fallback;
  } catch {
    return fallback;
  }
};

export const createNewPassword = async (payload: NewPasswordPayload): Promise<void> => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/new-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Create New Password'));
  }
};
