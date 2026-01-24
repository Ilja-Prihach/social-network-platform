export type ApiError<T = unknown> = {
  status: number;
  data: T;
};
