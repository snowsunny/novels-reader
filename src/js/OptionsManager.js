import _merge from 'lodash/merge'

export default class OptionsManager {
  constructor() {
    this.storageOptions = JSON.parse(localStorage.getItem('options'))
    this.defaultOptions = {
      version: chrome.app.getDetails().version,
      autoScroll: "on",
      title: "on",
      body: "on",
      autoPlay: "on",
      autoMoveNext: "on"
    }
  }

  saveOptions(options) {
    localStorage.setItem('options', JSON.stringify(
      _merge(options, {version: this.defaultOptions.version})
    ))
  }

  getInitOptions() {
    const checkStorageOptionsIsLatestVersion = () => {
      return this.storageOptions ? this.defaultOptions.version == this.storageOptions.version : false
    }
    if(checkStorageOptionsIsLatestVersion()) {
      return this.storageOptions
    } else {
      let mergedOptions = _merge({}, this.defaultOptions, this.storageOptions)
      this.saveOptions(mergedOptions)
      return mergedOptions
    }
  }
}
