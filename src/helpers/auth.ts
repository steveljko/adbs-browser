import type { LoginCredentials, User } from '@/api/types'
import authService from '@/services/authService'
import { computed, ref } from 'vue'
import axios from 'axios';

export function useAuth() {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const clientStatus = ref<string>("pending")
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)

  const login = async (data: LoginCredentials) => {
    const { access_token, user: userData } = await authService.login(data)

    user.value = userData;
    accessToken.value = access_token;
  }

  const fetchStatus = async () => {
    try {
      const { data: { status } } = await authService.fetchStatus()
      clientStatus.value = status
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const { status } = err.response?.data
        clientStatus.value = status || "pending"
      }
    }
  }

  return {
    user,
    clientStatus,
    isAuthenticated,
    login,
    fetchStatus,
  }
}
