import { defineStore } from 'pinia'
import OptionsManager from 'OptionsManager'
import DictionariesManager from 'DictionariesManager'

const managers = {
  opt: null,
  dic: null
}

export default defineStore('shared', {
  state: () => ({
    options: {},
    dictionaries: {},
    selectedNovelIndex: null
  }),
  getters: {
    SN: state => state.dictionaries[state.selectedNovelIndex],
    SNLink() {
      switch(this.SN.domain) {
        case 'ncode.syosetu.com':
          return `https://${this.SN.domain}/${this.SN.id}`
        case 'novel18.syosetu.com':
          return `https://${this.SN.domain}/${this.SN.id}`
        case 'kakuyomu.jp':
          return `https://${this.SN.domain}/works/${this.SN.id}`
      }
    }
  },
  actions: {
    async init() {
      managers.opt = await new OptionsManager()
      this.options = await managers.opt.storageOptions

      managers.dic = await new DictionariesManager()
      this.dictionaries = managers.dic.dictionaries
    },
    async saveOptions() {
      await managers.opt.saveOptions(this.options)
    },
    async saveDictionary() {
      await managers.dic.saveDictionary(this.SN)
    },
    async forceSaveDictionary() {
      await managers.dic.saveDictionary(this.SN, true)
    }
  }
})