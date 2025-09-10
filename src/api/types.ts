export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

export interface PingResponse {
  status: string;
}
