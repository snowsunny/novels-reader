import { defineStore } from 'pinia'
import OptionsManager from 'OptionsManager'
import DictionariesManager from 'DictionariesManager'
import UserManager from 'UserManager'
import Roudokuka from 'roudokuka'
import _clone from 'lodash/cloneDeep'

const managers = {
  options: null,
  dictionaries: null,
  user: null
}

export default defineStore('shared', {
  state: () => ({
    user: {
      dictionary: null,
      ignoreRubies: null
    },
    options: {},
    dictionaries: [],
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
        case 'localFile':
          return this.SN.id

      }
    }
  },
  actions: {
    async init() {
      // FIXME: 各マネージャーから値をstateにぶっ込む事によりマネージャーの値もリアクティブになるけど、まぁ各マネージャーでShared Store使った方が普通に良いよねぇ… 😇
      managers.options = await new OptionsManager()
      this.options = await managers.options.getInitializedData()

      managers.dictionaries = await new DictionariesManager()
      this.dictionaries = managers.dictionaries.dictionaries

      managers.user = await new UserManager()
      this.user = managers.user.user

      const roudokuka = new Roudokuka([''])
      await roudokuka.onReady()
      this.availableVoices = _clone(roudokuka.voices)
    },
    async saveUserDictionary() {
      await managers.user.saveDictionary(_clone(this.user.dictionary))
    },
    async saveUserIgnoreRubies() {
      await managers.user.saveIgnoreRubies(_clone(this.user.ignoreRubies))
    },
    async saveOptions() {
      await managers.options.saveOptions(_clone(this.options))
    },
    async saveDictionary() {
      await managers.dictionaries.saveDictionary(_clone(this.SN))
    },
    async forceSaveDictionary() {
      await managers.dictionaries.saveDictionary(_clone(this.SN), true)
    },
    async importData(data, isNewRubiesOnly, isOldVersion) {
      if(isOldVersion) {
        if(data.options) {
          Object.keys(data.options).forEach(key => {
            switch(key) {
              case 'rate':
                this.options.voice.rate = Number(data.options[key])
                break
              case 'pitch':
                this.options.voice.pitch = Number(data.options[key])
                break
              case 'volume':
                this.options.voice.volume = Number(data.options[key])
                break
              case 'voiceType':
                this.options.voice.typeIndex = Number(data.options[key])
                break

              case 'textColor':
                this.options.highlight.textColor = data.options[key]
                break
              case 'backgroundColor':
                this.options.highlight.backgroundColor = data.options[key]
                break
              case 'autoScroll':
                this.options.highlight.autoScroll = data.options[key] === 'on' ? true : false
                break

              case 'title':
                this.options.readSections.title = data.options[key] === 'on' ? true : false
                break
              case 'foreword':
                this.options.readSections.foreword = data.options[key] === 'on' ? true : false
                break
              case 'body':
                this.options.readSections.body = data.options[key] === 'on' ? true : false
                break
              case 'afterword':
                this.options.readSections.afterword = data.options[key] === 'on' ? true : false
                break

              case 'autoPlay':
                this.options.autoPlay = data.options[key] === 'on' ? true : false
                break
              case 'autoMoveNext':
                this.options.autoMoveNext = data.options[key] === 'on' ? true : false
                break
              case 'autoSaveDictionary':
                this.options.autoSaveDictionary = data.options[key] === 'on' ? true : false
                break
            }
          })
          await this.saveOptions()
        }

        if(data.dictionaries) {
          if(!isNewRubiesOnly) {
            await managers.dictionaries.deleteAllDictionaries()
          }
          data.dictionaries.forEach(async dictionary => {
            // ユーザーデータの処理 --------
            if(dictionary.id === 'user') {
              if(isNewRubiesOnly) {
                const newDictionaryLine = managers.dictionaries.getDictionaryText(managers.dictionaries.getNewRubiesOnly(dictionary.raw, this.user.dictionary))
                if(newDictionaryLine) {
                  this.user.dictionary = this.user.dictionary ?
                    this.user.dictionary + '\n' + newDictionaryLine:
                    this.user.dictionary + newDictionaryLine
                }
              } else {
                this.user.dictionary = dictionary.raw
              }
              await this.saveUserDictionary()
            } else if(dictionary.id === 'userIgnoreRubies') {
              this.user.ignoreRubies = data.user.ignoreRubies
              await this.saveUserIgnoreRubies()
            // 小説別辞書の処理 --------
            } else if(isNewRubiesOnly) {
              await managers.dictionaries.saveDictionary(dictionary)
            } else {
              await managers.dictionaries.saveDictionary(dictionary, true)
            }
          })

        }
      } else {
        // オプションデータの処理 --------
        if(data.options) {
          this.options = data.options
          await this.saveOptions()
        }

        // ユーザーデータの処理 --------
        if(data.user) {
          if(isNewRubiesOnly) {
            const newDictionaryLine = managers.dictionaries.getDictionaryText(managers.dictionaries.getNewRubiesOnly(data.user.dictionary, this.user.dictionary))
            if(newDictionaryLine) {
              this.user.dictionary = this.user.dictionary ?
                this.user.dictionary + '\n' + newDictionaryLine:
                this.user.dictionary + newDictionaryLine
            }
          } else {
            this.user.dictionary = data.user.dictionary
          }
          await this.saveUserDictionary()

          this.user.ignoreRubies = data.user.ignoreRubies
          await this.saveUserIgnoreRubies()
        }

        // 小説別辞書の処理 --------
        if(data.dictionaries) {
          if(isNewRubiesOnly) {
            data.dictionaries.forEach(async dictionary => {
              await managers.dictionaries.saveDictionary(dictionary)
            })
          } else {
            await managers.dictionaries.deleteAllDictionaries()
            data.dictionaries.forEach(async dictionary => {
              await managers.dictionaries.saveDictionary(dictionary, true)
            })
          }
        }
      }

      await this.init()
    }
  }
})