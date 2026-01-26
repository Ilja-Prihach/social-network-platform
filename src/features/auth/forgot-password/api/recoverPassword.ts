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
  baseUrl?: string;
};

export const recoverPassword = async ({
  email,
  recaptcha,
  baseUrl,
}: RecoverPasswordPayload): Promise<void> => {
  const resolvedBaseUrl =
    baseUrl ?? (typeof window === 'undefined' ? 'http://localhost:3000' : window.location.origin);
  console.log(recaptcha);
  const response = await fetch(`${BASE_URL}/api/v1/auth/password-recovery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, baseUrl: resolvedBaseUrl, recaptcha: recaptcha ?? '' }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "User with this email doesn't exist"));
  }
};
