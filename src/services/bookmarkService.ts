import { api } from "@/api/endpoints";
import axios, { AxiosResponse } from "axios";

export interface BookmarkData {
  url?: string;
  title?: string;
  description?: string;
}

export interface BookmarkService {
  createBookmark: (data: BookmarkData) => Promise<AxiosResponse>;
  updateBookmark: (id: number, data: BookmarkData) => Promise<AxiosResponse>;
  findByUrl: (url: string) => Promise<AxiosResponse>;
}

export const bookmarkService: BookmarkService = {
  createBookmark: async (data: BookmarkData) => await api.bookmark.create(data),

  updateBookmark: async (id: number, data: BookmarkData) =>
    await api.bookmark.update(id, data),

  findByUrl: async (url: string) => {
    try {
      const response = await api.bookmark.search({ url });
      return response;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          return err.response;
        }

        throw new Error(
          err.response?.data?.message || "Failed to check bookmark",
        );
      }
      throw err;
    }
  },
};

export default bookmarkService;
