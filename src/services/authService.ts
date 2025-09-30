import type { LoginCredentials, LoginResponse, RefreshTokenRequest } from '@/api/types'
import { getKey, setKey } from '@/helpers/storage'
import { AxiosError, AxiosResponse } from 'axios'
import { api } from '@/api/endpoints'

interface AuthService {
  login: (data: LoginCredentials) => Promise<LoginResponse>;
  fetchStatus: () => Promise<AxiosResponse>;
  refreshToken: (data: RefreshTokenRequest) => Promise<AxiosResponse<LoginResponse>>;
}

export const authService: AuthService = {
  login: async (data: LoginCredentials): Promise<LoginResponse> => {
    const identifier = await getKey('identifier')
    if (!identifier) {
      throw new Error('Browser identifier not found')
    }

    try {
      const {
        data: { access_token, refresh_token }
      } = await api.auth.login({ ...data, browser_identifier: identifier })

      await Promise.all([
        setKey('authToken', access_token),
        setKey('refreshToken', refresh_token)
      ])

      return data
    } catch (err) {
      const errorsData = (err as AxiosError).response.data?.errors
      const errorsMap: Record<string, string> = {}

      if (errorsData) {
        Object.keys(errorsData).forEach(field => {
          const fieldErrors = errorsData[field]
          if (Array.isArray(fieldErrors)) {
            fieldErrors.forEach(errorMsg => {
              if (errorMsg) {
                errorsMap[field] = errorMsg
              }
            })
          }
        })
      }

      throw new Error(JSON.stringify(errorsMap));
    }
  },

  fetchStatus: async () => {
    return await api.auth.status()
  },

  refreshToken: async (data: RefreshTokenRequest) => {
    return await api.auth.refresh(data)
  }
}

export default authService
