<template>
  <div>
    <FormGroup type="checkbox" label="Automatically save bookmarks" v-model="autoSave" name="save" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const autoSave = ref<boolean>(false)
</script>
