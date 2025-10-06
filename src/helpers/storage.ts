import browser from "webextension-polyfill"

type StorageKeys = "serverUrl" | "authToken" | "refreshToken" | "identifier"

type StoredValues = {
  serverUrl?: string
  authToken?: string
  refreshToken?: string
  identifier?: string
}

export async function getKey(key: StorageKeys): Promise<string | null> {
  const res = await browser.storage.local.get(key)
  const value = (res as StoredValues)[key]
  return typeof value === "string" ? value : null
}

export async function setKey(
  key: StorageKeys,
  value: string,
): Promise<boolean> {
  await browser.storage.local.set({ [key]: value })
  return true
}

export async function removeKey(key: StorageKeys): Promise<void> {
  await browser.storage.local.remove(key)
}
