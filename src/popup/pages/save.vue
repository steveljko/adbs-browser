<template>
  <div class="p-4">
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-white z-50 flex items-center justify-center"
    >
      <div class="text-center">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
        />
        <p class="mt-2 text-sm text-gray-600">Loading...</p>
      </div>
    </div>
    <div class="mb-2">
      <Button
        size="sm"
        class="block"
        @click="router.push({ path: '/default' })"
      >
        Back
      </Button>
    </div>
    <FormGroup
      v-model="siteData.title"
      label="Page Title"
      name="title"
    />
    <Tags
      v-model="siteData.tags"
      label="Tags"
    />
    <Button
      full
      @click="save"
    >
      Save Bookmark
    </Button>
  </div>
</template>

<script lang="ts" setup>
import { useBookmark } from "@/helpers/bookmark"
import { reactive, ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useTab } from "@/helpers/tab"

const router = useRouter()
const tab = useTab()

const isLoading = ref<boolean>(true)

const { checkIfExists, createOrUpdateCurrent } = useBookmark()

const siteData = reactive<{
  title: string
  tags: string[]
}>({
  title: "",
  tags: [],
})

onMounted(async () => {
  const { title } = await tab.getCurrent()
  const { exists, bookmark } = await checkIfExists()

  if (exists === true && bookmark) {
    if (bookmark.title) siteData.title = bookmark.title
    if (bookmark.tags) siteData.tags = bookmark.tags.map((t: string) => t.name)
  } else {
    if (title) siteData.title = title
  }

  isLoading.value = false
})

const save = async () => {
  const res = await createOrUpdateCurrent(siteData)
  if (res.status === 200 || res.status === 201)
    await router.push({ path: "/default" })
}
</script>
