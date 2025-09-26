<template>
  <section class="p-4">
    <div class="mb-4">
      <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
      <input type="email" id="email" placeholder="your@email.com"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        v-model="data.fields.email" @keydown="data.errors.email = ''" />
      <span class="block text-sm text-red-600 mt-2">{{ data.errors.email }}</span>
    </div>

    <div class="mb-6">
      <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
      <input type="password" id="password" placeholder="Enter your password"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        v-model="data.fields.password" @keydown="data.errors.password = ''" />
      <span class="block text-sm text-red-600 mt-2">{{ data.errors.password }}</span>
    </div>

    <Button class="mb-2" @click="login" :loading="data.loading">Sign In</Button>

    <Button class="mb-2" variant="secondary" @click="back">Back to Server Config</Button>

    <span class="block text-sm text-gray-600 text-center">Server URL is {{ serverUrl }}</span>
  </section>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getKey, removeKey } from '../../helpers/storage'
import { useAuth } from '../../helpers/auth'

const router = useRouter()
const auth = useAuth()

const serverUrl = ref<string>("")
onMounted(async () => {
  const url = await getKey("serverUrl")
  if (url != null) serverUrl.value = url.replace(/^https?:\/\//, "")
})

interface LoginErrors {
  email?: string
  password?: string
  [key: string]: string | undefined
}

const data = reactive({
  fields: {
    email: '',
    password: ''
  },
  message: '',
  errors: {} as LoginErrors,
  loading: false
})

const login = async () => {
  data.errors = {}
  data.loading = true

  try {
    await auth.login(data.fields)
    await router.push({ path: '/wait' })
  } catch (err) {
    const errors = JSON.parse((err as Error).message)
    data.errors = errors
  } finally {
    data.loading = false
  }
}

const back = async () => {
  await removeKey('serverUrl')
  router.back()
}
</script>
