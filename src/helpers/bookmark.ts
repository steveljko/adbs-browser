import bookmarkService, { BookmarkData } from "@/services/bookmarkService";
import tabService from "@/services/tabService";
import axios from "axios";
import browser from "webextension-polyfill";

export function useBookmark() {
  const create = async (data: browser.Bookmarks.BookmarkTreeNode) => {
    try {
      const response = await bookmarkService.createBookmark(data);

      if (response.status === 200) return response.data;
    } catch (err) {
      return err;
    }
  };

  const update = async (
    id: number,
    data: browser.Bookmarks.BookmarkTreeNode,
  ) => {
    try {
      const response = await bookmarkService.updateBookmark(id, data);

      if (response.status === 200) return response.data;
    } catch (err) {
      return err.response;
    }
  };

  const createOrUpdateCurrent = async (bookmarkData: BookmarkData) => {
    const { url } = await tabService.getCurrentTab();
    if (!url) {
      throw new Error("Current URL is not available — no active tab or URL.");
    }

    const { data } = await bookmarkService.findByUrl(url);

    if (!data.exists) {
      const response = await bookmarkService.createBookmark({
        ...bookmarkData,
        url,
      });
      return response;
    } else {
      try {
        const response = await bookmarkService.updateBookmark(
          data.bookmark.id,
          { ...bookmarkData },
        );
        return response;
      } catch (err) {
        console.log(err);
      }
    }
  };

  const checkIfExists = async () => {
    const { url } = await tabService.getCurrentTab();
    if (!url) {
      throw new Error("Current URL is not available — no active tab or URL.");
    }

    try {
      const response = await bookmarkService.findByUrl(url);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return err.response.data;
      }
    }
  };

  return {
    create,
    update,
    checkIfExists,
    createOrUpdateCurrent,
  };
}
