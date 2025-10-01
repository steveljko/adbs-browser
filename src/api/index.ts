import { getKey } from '@/helpers/storage'
import axios, { AxiosInstance } from 'axios'
import authService from '../services/authService'
import { useRouter } from 'vue-router'

let isRefreshing: boolean = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: any) => void
}> = []

const processQueue = (error: any, token: string | null = null): void => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })
  failedQueue = []
}

const router = useRouter()

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

  instance.interceptors.response.use(
    (response) => {
      return response
    },
    async (error) => {
      const originalRequest = error.config

      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => failedQueue.push({ resolve, reject }))
            .then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              return instance(originalRequest)
            }).catch(err => Promise.reject(err))
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          const { data: { access_token } } = await authService.refreshToken()
          instance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
          processQueue(null, access_token)
          originalRequest.headers.Authorization = `Bearer ${access_token}`
          return instance(originalRequest)
        } catch (err) {
          processQueue(err, null)
          await router.push({ path: '/login' })
          return Promise.reject(err)
        } finally {
          isRefreshing = false
        }
      }

      return Promise.reject(error)
    }
  )

  return instance
}
