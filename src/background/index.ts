import browser from 'webextension-polyfill'
import { v4 as uuidv4 } from 'uuid'
import { useBookmark } from '@/helpers/bookmark'

browser.runtime.onInstalled.addListener(async (details: browser.Runtime.OnInstalledDetailsType) => {
  if (details.reason === 'install') {
    const uuid = uuidv4()

    await browser.storage.local.set({
      serverUrl: '',
      authToken: '',
      identifier: uuid,
    })
  }
})

const bookmark = useBookmark()

browser.bookmarks.onCreated.addListener(async (id: string, b: browser.Bookmarks.BookmarkTreeNode) => {
  const r = await bookmark.create(b)
})
