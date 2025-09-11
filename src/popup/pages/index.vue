<template>
  <Header />
    <input
        class="px-3 py-1 border border-gray-300"
        v-model="serverUrl"
        placeholder="Server URL"
        />
    <span v-if="message">{{ message }}</span>
    <button @click="checkConn">Save Url</button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { getKey, setKey } from '../../helpers/storage'
import { api, setUrl } from '../../api/endpoints'

const router = useRouter()

const serverUrl = ref<string>('')
const message = ref<string>('')

onMounted(async () => {
  const url = await getKey("serverUrl")
  if (url) serverUrl.value = url
})

const checkConn = async () => {
  if (!serverUrl.value.trim()) {
    message.value = 'Server url is required.'
    return
  }

  setUrl(serverUrl.value)

  const resp = await api.server.ping()

  if (resp.status === 200) {
    console.log(resp)
  } else {
    setKey('serverUrl', '')
    message.value = 'Url is wrong, check it again!'
  }
}
</script>
