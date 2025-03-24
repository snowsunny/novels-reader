import _assign from 'lodash/assign'
import _find from 'lodash/find'
import _clone from 'lodash/cloneDeep'
import localForage from 'localforage'

export default class DictionariesManager {
  constructor() {
    this.dictionaries = null
    return localForage.getItem('dictionaries').then((dictionaries) => {
      this.dictionaries = dictionaries || []
      return this
    })
  }

  async saveDictionary(newDictionary, forceFlag) {
    let storageDictionary = this.getDictionary({id: newDictionary.id, domain: newDictionary.domain})
    if(storageDictionary) {
      if(!forceFlag) {
        if(newDictionary.raw) {
          let newline = storageDictionary.raw ? '\n' : ''
          let newRubies = this.getNewRubiesOnly(newDictionary.raw, storageDictionary.raw)
          newDictionary.raw = newRubies.length ?
            storageDictionary.raw + newline + this.getDictionaryText(newRubies) :
            storageDictionary.raw
        } else {
          newDictionary.raw = storageDictionary.raw
        }
      }
    } else {
      newDictionary.raw = newDictionary.raw || ''
      this.dictionaries.push(newDictionary)
    }
    _assign(storageDictionary, newDictionary)
    await localForage.setItem('dictionaries', _clone(this.dictionaries))
    return storageDictionary
  }

  async deleteAllDictionaries() {
    await localForage.setItem('dictionaries', null)
    this.dictionaries = []
  }

  getDictionary(findOption) {
    // standard findOption: {id: 'xxx', domain: 'xxx'}
    return _find(this.dictionaries, findOption)
  }

  getNewRubiesOnly(newDictionary, oldDictionary) {
    return this.getRubies(newDictionary).filter((ruby) => {
      return _find(this.getRubies(oldDictionary), ruby) == undefined
    })
  }

  getDictionaryText(rubies) {
    let dictionaryText = ''
    rubies.forEach((ruby) => {
      dictionaryText += `${ruby.rb}::${ruby.rt}\n`
    })
    return dictionaryText.trim()
  }

  getRubies(dictionaryText) {
    let lines = dictionaryText.split('\n').filter((ruby) => {
      return !/^\/\//.test(ruby) && ruby != ''
    })
    let rubies = []
    lines.forEach((line) => {
      let splited = line.split('::')
      rubies.push({rb: splited[0], rt: splited[1]})
    })
    return rubies
  }
}
