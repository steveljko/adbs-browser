import { api } from '@/api/endpoints'
import axios from 'axios'

export interface BookmarkData {
  url?: string
  title?: string
  description?: string
}

export interface BookmarkService {
  createBookmark: (data: BookmarkData) => Promise<any>;
  updateBookmark: (id: number, data: BookmarkData) => Promise<any>;
  findByUrl: (url: string) => Promise<any>;
}

export const bookmarkService: BookmarkService = {
  createBookmark: async (data: BookmarkData) => await api.bookmark.create(data),

  updateBookmark: async (id: number, data: BookmarkData) => await api.bookmark.update(id, data),

  findByUrl: async (url: string) => {
    try {
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
