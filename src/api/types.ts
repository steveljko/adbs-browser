export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

export interface PingResponse {
  status: string;
}

export type TokenStatus = 'active' | 'inactive' | 'pending' | 'revoked' | 'suspended';

export interface TokenStatusResponse {
  status: TokenStatus;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginRequest extends LoginCredentials {
  browser_identifier: string;
}

export interface User {
  name: string;
  email: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User,
  expires_in: number;
}

export interface RefreshTokenRequest {
  browser_identifier: string;
  refresh_token: string;
}
