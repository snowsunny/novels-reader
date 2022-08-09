import { defineStore } from 'pinia'
import OptionsManager from 'OptionsManager'
import DictionariesManager from 'DictionariesManager'

const manager = {
  opt: null,
  dic: null
}

export default defineStore('main', {
  state: () => ({
    options: null,
    dictionaries: null
  }),
  actions: {
    async init() {
      manager.opt = await new OptionsManager()
      this.options = await manager.opt.storageOptions

      manager.dic = await new DictionariesManager()
      this.dictionaries = manager.dic.dictionaries
    }
  }
})