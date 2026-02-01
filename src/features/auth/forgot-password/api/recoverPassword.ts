import { BASE_URL } from '@/shared/api/baseApi';

type ErrorResponse = {
  messages?: Array<{ message?: string; field?: string }>;
  error?: string;
  statusCode?: number;
};

const getErrorMessage = async (response: Response, fallback: string) => {
  try {
    const data = (await response.json()) as ErrorResponse;
    if (Array.isArray(data?.messages) && data.messages.length) {
      return data.messages[0]?.message || fallback;
    }
    return fallback;
  } catch {
    return fallback;
  }
};

export type RecoverPasswordPayload = {
  email: string;
  recaptcha?: string;
  locale?: string;
};

export const recoverPassword = async ({
  email,
  recaptcha,
  locale,
}: RecoverPasswordPayload): Promise<void> => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/password-recovery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      recaptcha: recaptcha ?? '',
      ...(locale ? { locale } : {}),
    }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "User with this email doesn't exist"));
  }
};
