<template>
  <div class="mb-4">
    <label
      :for="props.name"
      class="block text-sm font-medium mb-2"
    >
      {{ props.label }}
    </label>
    <input
      :id="props.name"
      v-model="inputValue"
      :type="props.type"
      :name="props.name"
      class="w-full text-md px-2 py-1.5 border border-gray-200 rounded"
      @input="handleInput"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"

interface Props {
  name: string
  label: string
  type?: "text" | "checkbox"
  modelValue?: string | boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  modelValue: "",
})

const emit = defineEmits<{
  "update:modelValue": [value: string | boolean]
}>()

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (props.type === "checkbox") {
    emit("update:modelValue", target.checked)
  } else {
    emit("update:modelValue", target.value)
  }
}
</script>
