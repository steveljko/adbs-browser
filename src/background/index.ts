import browser from 'webextension-polyfill'

browser.runtime.onInstalled.addListener(async (details: browser.Runtime.OnInstalledDetailsType) => {
  if (details.reason === 'install') {
    await browser.storage.local.set({
      serverUrl: '',
      authToken: '',
    })
  }
})
