<template>
  <div>
    <FormGroup
      v-model="autoSave"
      type="checkbox"
      label="Automatically save bookmarks"
      name="save"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const autoSave = ref<boolean>(false);
</script>
