import _merge from 'lodash/merge'
import _clone from 'lodash/cloneDeep'
import localForage from 'localforage'

export default class OptionsManager {
  constructor() {
    this.defaultOptions = {
      version: chrome.app.getDetails().version,
      readSections: {
        title: true,
        foreword: true,
        body: true,
        afterword: true
      },
      voice: {
        rate: 1,
        pitch: 1,
        volume: 1,
        typeIndex: -1
      },
      highlight: {
        textColor: '#fff',
        backgroundColor: '#498fd9',
        autoScroll: true
      },
      autoPlay: true,
      autoMoveNext: true,
      autoSaveDictionary: true
    }
    this.storageOptions = null
    return localForage.getItem('options').then((options) => {
      this.storageOptions = options
      return this
    })
  }

  async saveOptions(options) {
    return this.storageOptions = await localForage.setItem('options', _clone(options))
  }

  async getInitializedData() {
    const checkStorageOptionsIsLatestVersion = () => {
      return this.storageOptions ? this.defaultOptions.version === this.storageOptions.version : false
    }
    if(checkStorageOptionsIsLatestVersion()) {
      return this.storageOptions
    } else {
      if(this.storageOptions) {
        this.storageOptions.version = this.defaultOptions?.version
        return await this.saveOptions(_merge({}, this.defaultOptions, this.storageOptions))
      } else {
        return await this.saveOptions(_merge({}, this.defaultOptions))
      }
    }
  }
}
