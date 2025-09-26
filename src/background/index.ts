import browser from 'webextension-polyfill'
import { v4 as uuidv4 } from 'uuid'

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
