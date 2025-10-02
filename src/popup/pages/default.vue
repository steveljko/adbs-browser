<template>
  <section class="p-4">
    <Status :status="clientStatus" />

    <button @click="red">Settings</button>
    <button class="w-full py-2 rounded text-white" :class="{ 'bg-green-500': !isSaved, 'bg-yellow-500': isSaved }"
      @click="redSave">
      {{ !isSaved ? 'Add Current Page' : 'Update Bookmark' }}
    </button>
  </section>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useAuth } from '@/helpers/auth'
import { useBookmark } from '@/helpers/bookmark'
import { useRouter } from 'vue-router'

const {
  fetchStatus,
  clientStatus,
} = useAuth()

const { isSaved } = useBookmark()

const router = useRouter()

const red = async () => await router.push({ path: '/settings' })
const redSave = async () => await router.push({ path: '/save' })

onMounted(async () => {
  await fetchStatus()
})
</script>
