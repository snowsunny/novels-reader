// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if(tab.url != 'chrome://extensions/') {
//     chrome.tabs.query({url: 'chrome://extensions/'}, (tabsInfo) => {
//       chrome.tabs.reload(tabsInfo[0].id)
//     })
//   }
// })

import OptionsManager from 'OptionsManager'

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let om = new OptionsManager()
  if (request.method == "getOptions") {
    sendResponse(om.getInitOptions())
  } else {
    sendResponse(false)
  }
});
