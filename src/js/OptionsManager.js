import _merge from 'lodash/merge'
import localForage from 'localforage'

export default class OptionsManager {
  constructor() {
    this.defaultOptions = {
      version: chrome.app.getDetails().version,
      autoScroll: "on",
      title: "on",
      body: "on",
      autoPlay: "on",
      autoMoveNext: "on",
      autoSaveDictionary: "on"
    }
    this.storageOptions = null
    return localForage.getItem('options').then((options) => {
      this.storageOptions = options
      return this
    })
  }

  async saveOptions(options) {
    return this.storageOptions = await localForage.setItem('options', _merge(options, {version: this.defaultOptions.version}))
  }

  async getInitOptions() {
    const checkStorageOptionsIsLatestVersion = () => {
      return this.storageOptions ? this.defaultOptions.version == this.storageOptions.version : false
    }
    if(checkStorageOptionsIsLatestVersion()) {
      return this.storageOptions
    } else {
      return await this.saveOptions(_merge({}, this.defaultOptions, this.storageOptions))
    }
  }
}
