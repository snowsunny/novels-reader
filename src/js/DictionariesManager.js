import _merge from 'lodash/merge'
import _find from 'lodash/find'
import _findIndex from 'lodash/findIndex'
import _each from 'lodash/each'

export default class DictionariesManager {
  constructor() {
    this.dictionaries = this.getDictionaries() || []
  }

  saveDictionary(dictionary) {
    let index = _findIndex(this.dictionaries, {id: dictionary.id})
    if(index == -1) {
      dictionary.raw = this.getDictionaryText(dictionary.rubies)
      this.dictionaries.push(dictionary)
    } else {
      _merge(this.dictionaries[index], dictionary)
    }
    localStorage.setItem('dictionaries', JSON.stringify(this.dictionaries))
    return _find(this.dictionaries, {id: dictionary.id})
  }

  getDictionary(id) {
    return _find(this.dictionaries, {id: id})
  }

  getDictionaries() {
    return JSON.parse(localStorage.getItem('dictionaries'))
  }

  getDictionaryText(rubiesObject) {
    let dictionaryText = ''
    _each(rubiesObject, (rt, rb) => {
      dictionaryText += `${rb}::${rt}\n`
    })
    return dictionaryText.trim()
  }

  getRubiesObject(dictionaryText) {
    let lines = dictionaryText.split('\n').filter((ruby) => {
      return !/^\/\//.test(ruby) && ruby != ''
    })
    let rubiesObject = {}
    lines.forEach((line) => {
      let splited = line.split('::')
      rubiesObject[splited[0]] = splited[1]
    })
    return rubiesObject
  }
}
