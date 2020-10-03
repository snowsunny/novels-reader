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
    // for 1.3.0 or older --------
    if(!this.storageOptions) {
      let oldOptions = JSON.parse(localStorage.getItem('options'))
      if(oldOptions) {
        this.storageOptions = await localForage.setItem('options', oldOptions)
      }

      let oldDictionaries = JSON.parse(localStorage.getItem('dictionaries'))
      if(oldDictionaries) {
        oldDictionaries = oldDictionaries.map((dictionary) => {
          dictionary.id === 'user' || dictionary.id === 'userIgnoreRubies' ?
            dictionary.domain = 'novels-reader' : dictionary.domain = 'ncode.syosetu.com'
          delete dictionary.rubies
          return dictionary
        })
        await localForage.setItem('dictionaries', oldDictionaries)
      }
      // ここでlocalStorageの中身を削除しても良いが、現状ではそのままとする。
    }
    // --------

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
