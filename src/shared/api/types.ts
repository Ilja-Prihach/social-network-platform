export type ApiError<T = unknown> = {
  status: number;
  data: T;
};

export function isApiError<T = unknown>(error: unknown): error is ApiError<T> {
  return typeof error === 'object' && error !== null && 'status' in error && 'data' in error;
}
