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
import _each from 'lodash/each'

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

$(() => {
  let initOptions = getInitOptions()
  _each(initOptions, (value, key) => {
    let targetInput = $(`#options input[name=${key}]`)
    if(targetInput.attr('type') == 'checkbox') {
      if(value == 'on') {
        targetInput.prop('checked', true)
      }
    } else {
      targetInput.val(value)
    }
  })
  $('#options input').on('change', (e) => {
    let changedOptions = {}
    $('#options').serializeArray().forEach((option) => {
      changedOptions[option.name] = option.value
    })
    saveOptions(_merge(changedOptions, {version: initOptions.version}))
  })
})

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.method == "getOptions") {
//     sendResponse(getInitOptions())
//   } else {
//     sendResponse(false)
//   }
// });
