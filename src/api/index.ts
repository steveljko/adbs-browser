import { getKey } from '.././helpers/storage'
import axios, { AxiosInstance } from 'axios'

export const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  instance.interceptors.request.use(
    async (config) => {
      const baseUrl: string | null = await getKey('serverUrl')
      if (baseUrl) {
        const url: string = baseUrl.startsWith('http') 
          ? baseUrl
          : `http://${baseUrl}`
        
        config.baseURL = `${url}/api`
      }

      config.headers["X-Addon-Version"] = '0.0.0'

      let authToken = await getKey('authToken')
      if (authToken) config.headers.Authorization = `Bearer ${authToken}`

      return config
    })

    return instance
}
