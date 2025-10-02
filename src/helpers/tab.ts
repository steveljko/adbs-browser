import tabService from "@/services/tabService";

export function useTab() {
  const getCurrent = async () => {
    return await tabService.getCurrentTab()
  }

  return {
    getCurrent,
  }
}
