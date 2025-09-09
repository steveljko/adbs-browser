<template>
  <div
      class="w-80 p-4" 
      :class="{ 'bg-black': theme == 'dark', 'bg-white': theme != 'dark' }"
      >
      <Header />

        <main class="space-y-4">
          <label
              class="block text-sm font-medium mb-1"
              :class="{ 'text-white': theme == 'dark', 'text-black': theme == 'light' }"
              >
              Theme
          </label>
            <select 
              v-model="theme"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
        </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const theme = ref<"light"|"dark">("light")
</script>
