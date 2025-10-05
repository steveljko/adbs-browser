<template>
  <div>
    <span
      :class="[
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        statusClasses[status] || statusClasses.default,
      ]"
    >
      <span
        v-if="isLoading"
        class="inline-block mr-1.5 w-3 h-3 border-2 border-solid border-gray-300 border-t-2 border-t-blue-200 rounded-full animate-spin"
      />
      <span
        v-if="!isLoading"
        :class="[
          'w-1.5 h-1.5 rounded-full mr-1.5',
          dotClasses[status] || dotClasses.default,
        ]"
      />
      {{ text }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import type { TokenStatus } from "@/api/types";
import { computed } from "vue";

interface Props {
  status?: TokenStatus;
}

const props = withDefaults(defineProps<Props>(), { status: "loading" });

const isLoading = computed(() => props.status === "loading");

const statusClasses = computed(() => ({
  active: "bg-green-100 text-green-800 border border-green-200",
  inactive: "bg-red-100 text-red-800 border border-red-200",
  pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  revoked: "bg-red-100 text-red-800 border border-red-200",
  suspended: "bg-orange-100 text-orange-800 border border-orange-200",
  loading: "bg-gray-100 text-gray-500 border border-gray-200",
  default: "bg-gray-100 text-gray-800 border border-gray-200",
}));

const dotClasses = computed(() => ({
  active: "bg-green-400",
  inactive: "bg-red-400",
  pending: "bg-yellow-400",
  revoked: "bg-red-400",
  suspended: "bg-orange-400",
  loading: "bg-gray-400",
  default: "bg-gray-400",
}));

const text = computed(
  () => props.status.charAt(0).toUpperCase() + props.status.slice(1),
);
</script>
