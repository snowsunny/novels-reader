import { defineStore } from 'pinia'
import OptionsManager from 'OptionsManager'
import DictionariesManager from 'DictionariesManager'
import Roudokuka from 'roudokuka'
import _clone from 'lodash/clone'

const managers = {
  opt: null,
  dic: null,
}

export default defineStore('shared', {
  state: () => ({
    options: {},
    dictionaries: {},
    availableVoices: null,
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
      this.options = await managers.opt.getInitializedData()

      managers.dic = await new DictionariesManager()
      this.dictionaries = managers.dic.dictionaries

      const roudokuka = new Roudokuka([''])
      await roudokuka.onReady()
      this.availableVoices = roudokuka.voices
      console.log(roudokuka.voices)
    },
    async saveOptions() {
      await managers.opt.saveOptions(_clone(this.options))
    },
    async saveDictionary() {
      await managers.dic.saveDictionary(_clone(this.SN))
    },
    async forceSaveDictionary() {
      await managers.dic.saveDictionary(_clone(this.SN), true)
    }
  }
})