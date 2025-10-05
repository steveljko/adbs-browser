import browser from "webextension-polyfill";

export interface TabInfo {
  id?: number;
  url?: string;
  title?: string;
  favIconUrl?: string;
}

interface TabService {
  getCurrentTab: () => Promise<TabInfo>;
}

export const tabService: TabService = {
  getCurrentTab: async (): Promise<TabInfo> => {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab) {
      throw new Error("No active tab found");
    }

    return {
      id: tab.id,
      url: tab.url,
      title: tab.title,
      favIconUrl: tab.favIconUrl,
    };
  },
};

export default tabService;
