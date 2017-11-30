import _assign from 'lodash/assign'
import _find from 'lodash/find'

export default class DictionariesManager {
  constructor() {
    this.dictionaries = this.getDictionaries() || []
  }

  saveDictionary(newDictionary, forceFlag) {
    let storageDictionary = _find(this.dictionaries, {id: newDictionary.id})
    if(storageDictionary) {
      if(!forceFlag && storageDictionary.raw && newDictionary.raw) {
        let newRubies = this.getNewRubiesOnly(newDictionary, storageDictionary)
        newDictionary.raw = newRubies.length
          ? storageDictionary.raw + `\n${this.getDictionaryText(newRubies)}`
          : storageDictionary.raw
      }
      if(newDictionary.raw) {
        newDictionary.rubies = this.getRubies(newDictionary.raw)
      } else {
        if(forceFlag) {
          newDictionary.rubies = []
        } else {
          newDictionary.rubies = this.getRubies(storageDictionary.raw)
          delete newDictionary.raw
        }
      }
    } else {
      newDictionary.raw = newDictionary.raw || ''
      newDictionary.rubies = this.getRubies(newDictionary.raw)
      this.dictionaries.push(newDictionary)
    }
    _assign(storageDictionary, newDictionary)
    localStorage.setItem('dictionaries', JSON.stringify(this.dictionaries))
    return storageDictionary
  }

  getDictionary(id) {
    return _find(this.dictionaries, {id: id})
  }

  getDictionaries() {
    return JSON.parse(localStorage.getItem('dictionaries'))
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
