import { baseApi } from '@/shared/api/baseApi';

export interface SignUpRequest {
  login: string;
  email: string;
  password: string;
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

export type AuthErrorResponse = {
  statusCode: number;
  messages?: {
    message: string;
    field: string;
  }[];
  error: string;
};

export function signUp(data: SignUpRequest) {
  return baseApi<SignUpResponse>('/auth/registration', {
    method: 'POST',
    body: data,
  });
}

export function login(data: LoginRequest) {
  return baseApi<LoginResponse>('/v1/auth/login', {
    method: 'POST',
    body: data,
  });
}
