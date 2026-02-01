import { baseApi } from '@/shared/api/baseApi';
import { getToken } from '@/entities/auth/model/tokenStorage';

export interface SignUpRequest {
  userName: string;
  email: string;
  password: string;
  baseUrl: string;
}

export interface SignUpResponse {
  userId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
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
  const token = getToken();
  return baseApi<void>('/api/v1/auth/logout', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
