<template>
  <section class="p-4">
    <div class="p-2 border border-gray-200 bg-gray-50 mb-4">
      <div class="flex justify-between mb-1">
        <span class="text-[14px]">Server</span>
        <span class="text-[14px] font-medium">{{ serverUrl }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-[14px]">Status</span>
        <Status :status="clientStatus" />
      </div>
    </div>

    <button
      class="w-full py-2 bg-green-500 rounded text-white"
      @click="save"
    >
      Add Current Page
    </button>
  </section>
</template>

<script lang="ts" setup>
import { getKey } from "@/helpers/storage";
import { useAuth } from "@/helpers/auth";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";

const router = useRouter();

const serverUrl = ref<string>("");

const { fetchStatus, clientStatus } = useAuth();

const save = async () => await router.push({ path: "/save" });

onMounted(async () => {
  serverUrl.value = (await getKey("serverUrl")).replace(/^https?:\/\//i, "");
  await fetchStatus();
});
</script>
