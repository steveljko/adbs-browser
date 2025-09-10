import { createApiInstance } from './index'
import { ApiResponse, PingResponse } from './types'
import { AxiosInstance, AxiosResponse } from 'axios'
import { setKey } from '../helpers/storage'

let instance: AxiosInstance = createApiInstance()

export const setUrl = (url: string) => {
  const baseUrl: string = url.startsWith('http') 
    ? url
    : `http://${url}`

  instance.defaults.baseURL = `${baseUrl}/api`
}

export const api = {
  server: {
    ping: async (): Promise<AxiosResponse<ApiResponse<PingResponse>>> => await instance.get<ApiResponse<PingResponse>>('ping')
  }
}
