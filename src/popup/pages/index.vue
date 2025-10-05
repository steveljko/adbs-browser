<template>
  <section class="p-4">
    <div class="mb-4">
      <label class="mb-3 block text-sm font-medium text-gray-500"
        >Enter Server URL</label
      >
      <input
        v-model="serverUrl"
        class="block text-md w-full rounded-md border border-gray-300 px-3 py-2 mb-2 focus:border-orange-500 focus:outline-none"
        placeholder="Server URL"
        @keydown.enter="checkConn"
      />
      <span v-if="message" class="block text-sm text-red-500">{{
        message
      }}</span>
    </div>
    <Button @click="checkConn"> Connect </Button>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { getKey, setKey } from "@/helpers/storage";
import { api, setUrl } from "@/api/endpoints";

const router = useRouter();

const serverUrl = ref<string>("");
const message = ref<string>("");

onMounted(async () => {
  const token = await getKey("authToken");
  if (token) {
    await router.push({ path: "/default" });
    return;
  }

  const url = await getKey("serverUrl");
  if (url) {
    serverUrl.value = url;
    await router.push({ path: "/login" });
    return;
  }
});

const checkConn = async () => {
  if (!serverUrl.value.trim()) {
    message.value = "Server url is required.";
    return;
  }

  setUrl(serverUrl.value);

  try {
    const res = await api.server.ping();

    if (res.status === 200) router.push({ path: "/login" });
  } catch {
    setKey("serverUrl", "");
    message.value =
      "Service on this url is unreachable currently, check it again!";
  }
};
</script>
