import _merge from 'lodash/merge'
import _find from 'lodash/find'
import _findIndex from 'lodash/findIndex'

export default class DictionariesManager {
  constructor() {
    this.dictionaries = this.getDictionaries() || []
  }

  saveDictionary(dictionary) {
    let index = _findIndex(this.dictionaries, {id: dictionary.id})
    if(index == -1) {
      this.dictionaries.push(dictionary)
    } else {
      _merge(this.dictionaries[index], dictionary)
    }
    localStorage.setItem('dictionaries', JSON.stringify(this.dictionaries))
    return _find(this.dictionaries, {id: dictionary.id})
  }

  getDictionaries() {
    return JSON.parse(localStorage.getItem('dictionaries'))
  }
}
