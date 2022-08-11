import { defineStore } from 'pinia'
import OptionsManager from 'OptionsManager'
import DictionariesManager from 'DictionariesManager'

const manager = {
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
      manager.opt = await new OptionsManager()
      this.options = await manager.opt.storageOptions

      manager.dic = await new DictionariesManager()
      this.dictionaries = manager.dic.dictionaries
    },
    async saveDictionary() {
      await manager.dic.saveDictionary(this.SN)
    },
    async forceSaveDictionary() {
      await manager.dic.saveDictionary(this.SN, true)
    }
  }
})