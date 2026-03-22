export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: HeadersInit;
};

export type BaseApi = <T>(url: string, options?: RequestOptions) => Promise<T>;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  ok: boolean;
}

export type AuthErrorResponse = {
  statusCode: number;
  messages?: string | { message: string; field: string }[];
  error: string;
};

export const createAuthApi = (baseApi: BaseApi) => ({
  login: (data: LoginRequest) =>
    baseApi<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: data,
    }),
});
