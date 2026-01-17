export interface ApiError {
  errorsMessages: {
    field: string;
    message: string;
  }[];
}
