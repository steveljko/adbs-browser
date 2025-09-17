export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

export interface PingResponse {
  status: string;
}

export interface LoginResponse {
  status: string;
  token: string;
  user_name: string;
}
