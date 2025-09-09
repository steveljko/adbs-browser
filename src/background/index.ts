import browser from 'webextension-polyfill'

browser.runtime.onInstalled.addListener((details: browser.Runtime.OnInstalledDetailsType) => {
  console.log('Extension installed:', details.reason)
})
