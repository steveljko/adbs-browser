<template>
  <div class="mb-4">
    <label class="block text-sm font-medium mb-2">{{ label }}</label>

    <div class="flex gap-2 mb-2">
      <input
        v-model="inputValue"
        type="text"
        placeholder="Add a tag..."
        class="flex-1 text-md px-2 py-1.5 border border-gray-200 rounded"
        @keydown.enter.prevent="addTag"
      />
      <button
        type="button"
        class="px-3 py-1.5 bg-orange-500 text-white rounded hover:bg-orange-600"
        @click="addTag"
      >
        Add
      </button>
    </div>

    <div class="flex flex-wrap gap-2">
      <span
        v-for="(tag, index) in tags"
        :key="index"
        class="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
      >
        {{ tag }}
        <button
          type="button"
          class="hover:text-red-500 font-bold"
          @click="removeTag(index)"
        >
          ×
        </button>
      </span>
    </div>

    <p
      v-if="tags.length === 0"
      class="text-sm text-gray-400 mt-2"
    >
      No tags added yet
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue"

interface Props {
  label?: string
  modelValue?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  label: "Tags",
  modelValue: () => [],
})

const emit = defineEmits<{
  "update:modelValue": [value: string[]]
}>()

const inputValue = ref("")

const tags = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
})

const addTag = () => {
  const tag = inputValue.value.trim()
  if (tag && !tags.value.includes(tag)) {
    tags.value = [...tags.value, tag]
    inputValue.value = ""
  }
}

const removeTag = (index: number) => {
  tags.value = tags.value.filter((_, i) => i !== index)
}
</script>
