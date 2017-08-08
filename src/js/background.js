// for dev
// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if(tab.url != 'chrome://extensions/') {
//     chrome.tabs.query({url: 'chrome://extensions/'}, (tabsInfo) => {
//       chrome.tabs.reload(tabsInfo[0].id)
//     })
//   }
// })

import OptionsManager from 'OptionsManager'
import DictionariesManager from 'DictionariesManager'

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let om = new OptionsManager()
  let dm = new DictionariesManager()

  switch(request.method) {
    case 'getOptions':
      sendResponse(om.getInitOptions())
      break

    case 'saveDictionary':
      sendResponse(dm.saveDictionary(request.dictionary))
      break

    default:
      sendResponse(false)
  }
});
