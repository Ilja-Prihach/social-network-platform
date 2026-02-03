import { baseApi } from '@/shared/api/baseApi';
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

type ApiError<T> = {
  status: number;
  data: T | null;
};

const getRecoverPasswordErrorMessage = (error: unknown, fallback: string) => {
  const apiError = error as ApiError<RecoverPasswordErrorResponse>;
  const data = apiError?.data;
  if (Array.isArray(data?.messages) && data.messages.length) {
    return data.messages[0]?.message || fallback;
  }
  if (typeof data?.error === 'string' && data.error) return data.error;
  return fallback;
};

const getCreateNewPasswordErrorMessage = (error: unknown, fallback: string) => {
  const apiError = error as ApiError<CreateNewPasswordErrorResponse>;
  const data = apiError?.data;
  return data?.errorsMessages?.[0]?.message || fallback;
};

export const recoverPassword = async ({
  email,
  recaptcha,
  locale,
}: RecoverPasswordPayload): Promise<void> => {
  try {
    await baseApi<void>('/api/v1/auth/password-recovery', {
      method: 'POST',
      body: {
        email,
        recaptcha: recaptcha ?? '',
        ...(locale ? { locale } : {}),
      },
    });
  } catch (error) {
    throw new Error(getRecoverPasswordErrorMessage(error, "User with this email doesn't exist"));
  }
};

export const createNewPassword = async ({
  newPassword,
  recoveryCode,
}: CreateNewPasswordPayload): Promise<void> => {
  try {
    await baseApi<void>('/api/v1/auth/new-password', {
      method: 'POST',
      body: { newPassword, recoveryCode },
    });
  } catch (error) {
    throw new Error(getCreateNewPasswordErrorMessage(error, 'Create New Password'));
  }
};
