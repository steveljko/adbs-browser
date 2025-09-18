export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

export interface PingResponse {
  status: string;
}

type TokenStatus = 'Active' | 'Inactive' | 'Pending' | 'Revoked' | 'Suspended';

export interface TokenStatusResponse {
  status: TokenStatus;
}

export interface LoginResponse {
  status: string;
  token: string;
  user_name: string;
}
