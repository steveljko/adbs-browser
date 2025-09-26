import { computed, ref } from 'vue'
import { api } from '../api/endpoints'
import { getKey, setKey } from '../helpers/storage'

interface LoginCredentials {
  email: string;
  password: string;
}

export function useAuth() {
  const user = ref(null)
  const accessToken = ref<string | null>(null)
  // const refreshToken = ref(null)
  // const extKey = ref(null)
  // const isRefreshing = ref(false)

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)

  const login = async (fields: LoginCredentials) => {
    const browserIdentifier = await getKey('identifier')

    try {
      const res = await api.auth.login(
        fields.email,
        fields.password,
        browserIdentifier,
      )

      const { access_token, refresh_token } = res.data;
      await setKey('authToken', access_token)
      await setKey('refreshToken', refresh_token)

      accessToken.value = access_token;
    } catch (err) {
      const errorsData = err.response.data.errors
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
  }

  const status = async () => {
    try {
      const res = await api.auth.status()
      return res
    } catch (err) {
      const status = err.response.status

      if (status === 401) {
        // handle refresh token
        throw new Error(JSON.stringify({ status: 'unauthorized' }))
      }

      if (status === 403) {
        throw new Error(JSON.stringify(err.response.data))
      }
    }
  }

  return {
    login,
    status,
    isAuthenticated,
  }
}
