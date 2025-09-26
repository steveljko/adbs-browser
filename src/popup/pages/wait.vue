<template>
  <section class="p-4">
    <p>Status: {{ status }}</p>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '../../helpers/auth'

const auth = useAuth()

const status = ref<string>("")

onMounted(async () => {
  try {
    const res = await auth.status()
    console.log(res)
    status.value = res.data.status
  } catch (err) {
    console.log(err)
    const error = JSON.parse(err.message)
    status.value = error.status
  }
})
</script>
