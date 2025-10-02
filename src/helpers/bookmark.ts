import { ref, onMounted } from 'vue'
import bookmarkService from '@/services/bookmarkService'
import browser from 'webextension-polyfill'

export function useBookmark() {
  const isSaved = ref<boolean>(false)

  onMounted(async () => {
    isSaved.value = await checkIfSaved()
  })

  const create = async (data: browser.Bookmarks.BookmarkTreeNode) => {
    try {
      const response = await bookmarkService.createBookmark(data)

      if (response.status === 200) return response.data
    } catch (err) {
      return err
    }
  }

  const checkIfSaved = async () => {
    try {
      const response = await bookmarkService.isBookmarkAlreadySaved()
      const { exists } = response.data

      return exists
    } catch (err) {
      isSaved.value = false
    }
  }

  return {
    create,
    isSaved,
  }
}
