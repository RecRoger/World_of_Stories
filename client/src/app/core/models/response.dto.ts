export interface ApiResponse<T> {
  ok?: boolean,
  message?: string,
  data: {
    [key: string]: T
  },
}