import { baseApi } from '@/shared/api/baseApi';

export interface SignUpRequest {
  login: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  userId: string;
}

export function signUp(data: SignUpRequest) {
  return baseApi<SignUpResponse>('/auth/registration', {
    method: 'POST',
    body: data,
  });
}
