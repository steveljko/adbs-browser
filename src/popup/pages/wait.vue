<template>
  <section class="p-4">
    <Status :status="clientStatus" />
    {{ accessToken }}
  </section>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useAuth } from '@/helpers/auth'

const {
  fetchStatus,
  clientStatus,
} = useAuth()

onMounted(async () => await fetchStatus())
</script>
