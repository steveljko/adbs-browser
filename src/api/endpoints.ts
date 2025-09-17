import { createApiInstance } from './index'
import type { ApiResponse, PingResponse, LoginResponse } from './types'
import { AxiosInstance, AxiosResponse } from 'axios'
import { setKey } from '../helpers/storage'

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
    login: (email: string, password: string) => Promise<AxiosResponse<LoginResponse>>;
  };
};

export const api: ApiType = {
  server: {
    ping: async (): Promise<AxiosResponse<ApiResponse<PingResponse>>> => await instance.get<ApiResponse<PingResponse>>('ping')
  },
  auth: {
    login: async (email: string, password: string): Promise<AxiosResponse<LoginResponse>> => await instance.post<LoginResponse>('login', { email, password })
  },
}
