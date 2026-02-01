type ErrorResponse = {
  errorsMessages?: Array<{ message?: string }>;
  messages?: Array<{ message?: string }>;
};

const getErrorMessage = async (response: Response, fallback: string) => {
  try {
    const data = (await response.json()) as ErrorResponse;
    return data?.errorsMessages?.[0]?.message || data?.messages?.[0]?.message || fallback;
  } catch {
    return fallback;
  }
};

export const resendVerification = async (email: string): Promise<void> => {
  const response = await fetch('/api/v1/auth/registration-email-resending', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Unable to resend verification link'));
  }
};
