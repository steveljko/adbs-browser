import { createApiInstance } from '@/api/index'
import type { ApiResponse, PingResponse, TokenStatusResponse, LoginRequest, LoginResponse, RefreshTokenRequest } from '@/api/types'
import { AxiosInstance, AxiosResponse } from 'axios'
import { setKey } from '@/helpers/storage'

let instance: AxiosInstance = createApiInstance()

export const setUrl = (url: string) => {
  const baseUrl: string = url.startsWith('http') ? url : `http://${url}`
  setKey('serverUrl', baseUrl)

  instance.defaults.baseURL = `${baseUrl}/api`
}

type ApiType = {
  server: {
    ping: () => Promise<AxiosResponse<ApiResponse<PingResponse>>>;
  };
  auth: {
    login: (data: LoginRequest) => Promise<AxiosResponse<LoginResponse>>;
    status: () => Promise<AxiosResponse<TokenStatusResponse>>;
    refresh: (data: RefreshTokenRequest) => Promise<AxiosResponse<LoginResponse>>;
  };
  bookmark: {
    create: (data: any) => Promise<AxiosResponse>;
    update: (id: number, data: any) => Promise<AxiosResponse>;
    search: (url: string) => Promise<AxiosResponse>;
  };
};

export const api: ApiType = {
  server: {
    ping: async (): Promise<AxiosResponse<ApiResponse<PingResponse>>> => await instance.get<ApiResponse<PingResponse>>('ping'),
  },
  auth: {
    login: async (data: LoginRequest): Promise<AxiosResponse<LoginResponse>> => await instance.post<LoginResponse>('login', data),
    status: async (): Promise<AxiosResponse<TokenStatusResponse>> => await instance.get<TokenStatusResponse>('token/status'),
    refresh: async (data: RefreshTokenRequest): Promise<AxiosResponse<LoginResponse>> => await instance.post<LoginResponse>('token/refresh', data),
  },
  bookmark: {
    create: async (data): Promise<AxiosResponse> => await instance.post('bookmark', data),
    update: async (id, data): Promise<AxiosResponse> => await instance.patch(`bookmark/${id}`, data),
    search: async (url: string): Promise<AxiosResponse> => await instance.post('bookmark/search', url),
  },
}
