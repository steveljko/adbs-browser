<script lang="ts" setup>
import { ref, computed } from "vue"

interface Props {
  disabled?: boolean
  loading?: boolean
  variant?: "primary" | "secondary" | "danger"
  size?: "sm" | "md" | "lg"
  full?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  loading: false,
  variant: "primary",
  size: "md",
})

const emit = defineEmits<{ click: [] }>()

const isLoading = ref(false)

const buttonClasses = computed(() => {
  const base =
    "font-medium rounded-md transition duration-100 ease-in-out flex items-center justify-center"

  const variants = {
    primary: "bg-orange-500 hover:bg-orange-500 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  }

  const sizes = {
    sm: "py-1 px-3 text-sm",
    md: "py-2 px-4",
    lg: "py-3 px-6 text-lg",
  }

  const disabledClasses = "opacity-50 cursor-not-allowed"

  const isFull = props.full ? "w-full" : ""

  return [
    base,
    variants[props.variant],
    sizes[props.size],
    isFull,
    (props.disabled || props.loading || isLoading.value) && disabledClasses,
  ]
    .filter(Boolean)
    .join(" ")
})

const handleClick = async () => {
  if (props.disabled || props.loading || isLoading.value) {
    return
  }

  try {
    isLoading.value = true
    emit("click")

    await new Promise((resolve) => setTimeout(resolve, 500))
  } catch (error) {
    console.error("Login error:", error)
  } finally {
    isLoading.value = false
  }
}

const showSpinner = computed(() => props.loading || isLoading.value)
</script>

<template>
  <button
    id="loginBtn"
    :class="buttonClasses"
    :disabled="disabled || loading || isLoading"
    @click="handleClick"
  >
    <span
      v-if="showSpinner"
      class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
    />
    <span><slot /></span>
  </button>
</template>
