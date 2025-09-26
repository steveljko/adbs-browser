import { getKey, setKey, removeKey } from '.././helpers/storage'
import axios, { AxiosInstance } from 'axios'
import { api } from './endpoints'
import { useRouter } from 'vue-router'

const router = useRouter()

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

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
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          }).then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return instance(originalRequest)
          }).catch(err => {
            return Promise.reject(err)
          });
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          const refreshToken = await getKey('refreshToken')
          const browserIdentifier = await getKey('identifier')

          if (!refreshToken) {
            throw new Error('No refresh token available')
          }

          const response = await api.auth.refresh(browserIdentifier, refreshToken)
          const { access_token, refresh_token: newRefreshToken } = response.data

          await setKey('authToken', access_token)
          if (newRefreshToken) {
            await setKey('refreshToken', newRefreshToken)
          }

          instance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

          processQueue(null, access_token)

          originalRequest.headers.Authorization = `Bearer ${access_token}`
          return instance(originalRequest)
        } catch (error) {
          console.log(error.response.data)
          processQueue(error, null)

          await removeKey('authToken')
          await removeKey('refreshToken')

          router.push({ path: '/login' })

          return Promise.reject(error)
        } finally {
          isRefreshing = false
        }
      }

      return Promise.reject(error)
    }
  )

  return instance
}
