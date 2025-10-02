import tabService from '@/services/tabService'
import browser from 'webextension-polyfill'
import { api } from '@/api/endpoints'
import axios from 'axios'

export interface BookmarkData {
  url?: string
  title?: string
  description?: string
}

export interface BookmarkService {
  createBookmark: (bookmarkData: BookmarkData) => Promise<any>;
  isBookmarkAlreadySaved: () => Promise<any>;
}

export const bookmarkService: BookmarkService = {
  createBookmark: (data: BookmarkData) => api.bookmark.create(data),

  isBookmarkAlreadySaved: async () => {
    try {
      const { url } = await tabService.getCurrentTab()
      const response = await api.bookmark.search({ url })
      return response
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          return err.response
        }

        throw new Error(err.response?.data?.message || 'Failed to check bookmark')
      }
      throw err
    }
  },
}

export default bookmarkService
