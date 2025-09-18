import { getKey, removeKey } from '.././helpers/storage'
import axios, { AxiosInstance } from 'axios'
import { useRouter } from 'vue-router'

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
        if (error.response) {
          const code = error.response.status

          if (code === 401) {
            await removeKey('authToken')
            await router.push({ path: '/' })
          }
        }

        return Promise.reject(error)
      }
    )

    return instance
}
