import { BASE_URL, baseApi } from '@/shared/api/baseApi';
export interface SignUpRequest {
  userName: string;
  email: string;
  password: string;
  baseUrl?: string;
}

export interface SignUpResponse {
  userId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  ok: boolean;
}

export interface RegistrationConfirmationRequest {
  code: string;
}

export type AuthErrorResponse = {
  statusCode: number;
  messages?: {
    message: string;
    field: string;
  }[];
  error: string;
};

export type RecoverPasswordPayload = {
  email: string;
  recaptcha?: string;
  locale?: string;
};

export type CreateNewPasswordPayload = {
  newPassword: string;
  recoveryCode: string;
};

export function signUp(data: SignUpRequest) {
  return baseApi<SignUpResponse>('/api/v1/auth/registration', {
    method: 'POST',
    body: data,
  });
}

export function login(data: LoginRequest) {
  return baseApi<LoginResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: data,
  });
}

export function confirmRegistration(data: RegistrationConfirmationRequest) {
  return baseApi<void>('/api/v1/auth/registration-confirmation', {
    method: 'POST',
    body: { confirmationCode: data.code },
  });
}

export function logout() {
  return baseApi<void>('/api/v1/auth/logout', {
    method: 'POST',
  });
}

type RecoverPasswordErrorResponse = {
  messages?: Array<{ message?: string; field?: string }>;
  error?: string;
  statusCode?: number;
};

type CreateNewPasswordErrorResponse = {
  errorsMessages?: Array<{ message?: string }>;
};

const getRecoverPasswordErrorMessage = async (response: Response, fallback: string) => {
  try {
    const data = (await response.json()) as RecoverPasswordErrorResponse;
    if (Array.isArray(data?.messages) && data.messages.length) {
      return data.messages[0]?.message || fallback;
    }
    return fallback;
  } catch {
    return fallback;
  }
};

const getCreateNewPasswordErrorMessage = async (response: Response, fallback: string) => {
  try {
    const data = (await response.json()) as CreateNewPasswordErrorResponse;
    return data?.errorsMessages?.[0]?.message || fallback;
  } catch {
    return fallback;
  }
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
    throw new Error(
      await getRecoverPasswordErrorMessage(response, "User with this email doesn't exist"),
    );
  }
};

export const createNewPassword = async ({
  newPassword,
  recoveryCode,
}: CreateNewPasswordPayload): Promise<void> => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/new-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newPassword, recoveryCode }),
  });

  if (!response.ok) {
    throw new Error(await getCreateNewPasswordErrorMessage(response, 'Create New Password'));
  }
};
