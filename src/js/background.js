let storageOptions = JSON.parse(localStorage.getItem('options'))
let defaultOptions = {
  version: chrome.app.getDetails().version,
  autoScroll: "on",
  title: "on",
  body: "on",
  autoPlay: "on",
  autoMoveNext: "on"
}

import _merge from 'lodash/merge'

const saveOptions = (options) => {
  localStorage.setItem('options', JSON.stringify(options))
}

const getInitOptions = () => {
  const checkStorageOptionsIsLatestVersion = () => {
    return storageOptions ? defaultOptions.version == storageOptions.version : false
  }
  if(checkStorageOptionsIsLatestVersion()) {
    return storageOptions
  } else {
    let mergedOptions = _merge({}, defaultOptions, storageOptions)
    saveOptions(mergedOptions)
    return mergedOptions
  }
}

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if(tab.url != 'chrome://extensions/') {
//     chrome.tabs.query({url: 'chrome://extensions/'}, (tabsInfo) => {
//       chrome.tabs.reload(tabsInfo[0].id)
//     })
//   }
// })

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.method == "getOptions") {
    storageOptions = JSON.parse(localStorage.getItem('options'))
    sendResponse(getInitOptions())
  } else {
    sendResponse(false)
  }
});
