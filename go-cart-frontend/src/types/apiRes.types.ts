export type ApiResponse<T> = {
  message: string;
  data?: T;
};

export type ErrorResponse = {
  error: string;
};
