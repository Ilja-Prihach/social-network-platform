import { baseApi } from '@/shared/api/baseApi';
import { createAuthApi } from '@auth-core/authApi';

export interface SignUpRequest {
  userName: string;
  email: string;
  password: string;
  baseUrl?: string;
}

export interface SignUpResponse {
  userId: string;
}

export type SessionItem = {
  deviceId: number;
  ip: string;
  lastActive: string;
  browserName: string;
  browserVersion: string;
  deviceName: string;
  osName: string;
  osVersion: string;
  deviceType: string;
};

export type SessionsResponse = {
  current: SessionItem;
  others: SessionItem[];
};

export type GithubUpdateTokensResponse = {
  accessToken: string;
};

export type GithubAcceptRequest = {
  accessToken: string;
};

export type GoogleLoginRequest = {
  redirectUrl: string;
  code: string;
};

export type GoogleLoginResponse = {
  accessToken: string;
  email: string;
};

export interface RegistrationConfirmationRequest {
  code: string;
}

export type {
  AuthErrorResponse,
  LoginRequest,
  LoginResponse,
} from '@auth-core/authApi';

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
  return baseApi<SignUpResponse>('/api/auth/registration', {
    method: 'POST',
    body: data,
  });
}

export const { login } = createAuthApi(baseApi);

export function acceptGithubAccessToken(data: GithubAcceptRequest) {
  return baseApi<{ ok: boolean }>('/api/auth/github/accept', {
    method: 'POST',
    body: data,
  });
}

export function githubUpdateTokens() {
  return baseApi<GithubUpdateTokensResponse>('/api/auth/github/update-tokens', {
    method: 'POST',
  });
}

export function googleLogin(data: GoogleLoginRequest) {
  return baseApi<GoogleLoginResponse>('/api/auth/google/login', {
    method: 'POST',
    body: data,
  });
}

export function confirmRegistration(data: RegistrationConfirmationRequest) {
  return baseApi<void>('/api/auth/registration-confirmation', {
    method: 'POST',
    body: { confirmationCode: data.code },
  });
}

export function logout() {
  return baseApi<void>('/api/auth/logout', {
    method: 'POST',
  });
}

export function getSessions() {
  return baseApi<SessionsResponse>('/api/auth/sessions', {
    method: 'GET',
  });
}

export function terminateAllSessions() {
  return baseApi<void>('/api/auth/sessions/terminate-all', {
    method: 'DELETE',
  });
}

export function terminateSessionByDeviceId(deviceId: number) {
  return baseApi<void>(`/api/auth/sessions/${deviceId}`, {
    method: 'DELETE',
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
    await baseApi<void>('/api/auth/password-recovery', {
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
    await baseApi<void>('/api/auth/new-password', {
      method: 'POST',
      body: { newPassword, recoveryCode },
    });
  } catch (error) {
    throw new Error(getCreateNewPasswordErrorMessage(error, 'Create New Password'));
  }
};
