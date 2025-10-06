import type { LoginCredentials, LoginResponse } from "@/api/types"
import { getKey, setKey, removeKey } from "@/helpers/storage"
import { AxiosError, AxiosResponse } from "axios"
import { api } from "@/api/endpoints"
import { v4 as uuidv4 } from "uuid"

interface AuthService {
  login: (data: LoginCredentials) => Promise<LoginResponse>
  fetchStatus: () => Promise<AxiosResponse>
  refreshToken: () => Promise<AxiosResponse<LoginResponse>>
}

export const authService: AuthService = {
  login: async (data: LoginCredentials): Promise<LoginResponse> => {
    const identifier = await getKey("identifier")
    if (!identifier) {
      throw new Error("Browser identifier not found")
    }

    try {
      const {
        data: { access_token, refresh_token },
      } = await api.auth.login({ ...data, browser_identifier: identifier })

      await Promise.all([
        setKey("authToken", access_token),
        setKey("refreshToken", refresh_token),
      ])

      return data
    } catch (err) {
      const errorsData = (err as AxiosError).response.data?.errors
      const errorsMap: Record<string, string> = {}

      if (errorsData) {
        Object.keys(errorsData).forEach((field) => {
          const fieldErrors = errorsData[field]
          if (Array.isArray(fieldErrors)) {
            fieldErrors.forEach((errorMsg) => {
              if (errorMsg) {
                errorsMap[field] = errorMsg
              }
            })
          }
        })
      }

      throw new Error(JSON.stringify(errorsMap))
    }
  },

  fetchStatus: async () => {
    return await api.auth.status()
  },

  refreshToken: async () => {
    try {
      const refreshToken = await getKey("refreshToken")
      if (!refreshToken) {
        throw new Error("No refresh token available")
      }

      const browserIdentifier = await getKey("identifier")
      if (!browserIdentifier) {
        throw new Error("Browser identifier not found")
      }

      const response = await api.auth.refresh({
        browser_identifier: browserIdentifier,
        refresh_token: refreshToken,
      })
      const { access_token, refresh_token: newRefreshToken } = response.data

      await setKey("authToken", access_token)
      if (newRefreshToken) {
        await setKey("refreshToken", newRefreshToken)
      }

      return response
    } catch (error) {
      await removeKey("authToken")
      await removeKey("refreshToken")

      await removeKey("identifier")
      await setKey("identifier", uuidv4()) // get new identifier

      return Promise.reject(error)
    }
  },
}

export default authService
