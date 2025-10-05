<template>
  <div class="p-4">
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
import { useBookmark } from "@/helpers/bookmark";
import { reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useTab } from "@/helpers/tab";

const router = useRouter();
const tab = useTab();

const { checkIfExists, createOrUpdateCurrent } = useBookmark();

const siteData = reactive<{
  title: string;
  tags: string[];
}>({
  title: "",
  tags: [],
});

onMounted(async () => {
  const { title } = await tab.getCurrent();
  const { exists, bookmark } = await checkIfExists();

  if (exists === true && bookmark) {
    if (bookmark.title) siteData.title = bookmark.title;
    if (bookmark.tags) siteData.tags = bookmark.tags.map((t: string) => t.name);
  } else {
    if (title) siteData.title = title;
  }
});

const save = async () => {
  try {
    const res = await createOrUpdateCurrent(siteData);
    if (res.status === 200) await router.push({ path: "/default" });
  } catch (err) {
    console.log(err);
  }
};
</script>
