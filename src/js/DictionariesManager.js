import _assign from 'lodash/assign'
import _find from 'lodash/find'
import localForage from 'localforage'

export default class DictionariesManager {
  constructor() {
    this.dictionaries = null
    return this.getDictionaries().then((dictionaries) => {
      this.dictionaries = dictionaries || []
      return this
    })
  }

  async saveDictionary(newDictionary, forceFlag) {
    let storageDictionary = _find(this.dictionaries, {id: newDictionary.id})
    if(storageDictionary) {
      if(!forceFlag && storageDictionary.raw && newDictionary.raw) {
        let newRubies = this.getNewRubiesOnly(newDictionary, storageDictionary)
        newDictionary.raw = newRubies.length
          ? storageDictionary.raw + `\n${this.getDictionaryText(newRubies)}`
          : storageDictionary.raw
      }
    } else {
      newDictionary.raw = newDictionary.raw || ''
      this.dictionaries.push(newDictionary)
    }
    _assign(storageDictionary, newDictionary)
    await localForage.setItem('dictionaries', this.dictionaries)
    return storageDictionary
  }

  getDictionary(id) {
    return _find(this.dictionaries, {id: id})
  }

  async getDictionaries() {
    return await localForage.getItem('dictionaries')
  }

  getNewRubiesOnly(newDictionary, oldDictionary) {
    return this.getRubies(newDictionary.raw).filter((ruby) => {
      return _find(this.getRubies(oldDictionary.raw), ruby) == undefined
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
