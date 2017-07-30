// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if(tab.url != 'chrome://extensions/') {
//     chrome.tabs.query({url: 'chrome://extensions/'}, (tabsInfo) => {
//       chrome.tabs.reload(tabsInfo[0].id)
//     })
//   }
// })

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.method == "getOptions") {
      sendResponse(JSON.parse(localStorage[request.key]))
    } else {
      sendResponse(false)
    }
});
