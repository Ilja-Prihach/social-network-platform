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

export const resendVerification = async (email: string): Promise<void> => {
  const response = await fetch('/api/auth/resend-verification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Unable to resend verification link'));
  }
};
