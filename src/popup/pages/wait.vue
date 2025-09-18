<template>
  <section class="p-4">
    <p>Status: {{ status }}</p>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { api } from '../../api/endpoints'

const status = ref<string>("")

onMounted(async () => {
  try {
    const res = await api.auth.status()

    if (res.status === 200) {
      status.value = "ok"
    }
  } catch (err) {
    status.value = "fail"
  }
})
</script>
