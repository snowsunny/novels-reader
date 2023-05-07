import _clone from 'lodash/cloneDeep'
import localForage from 'localforage'

export default class UserManager {
  constructor() {
    this.user = null
    return localForage.getItem('user').then((user) => {
      if(user) {
        this.user = user
        return this
      } else {
        return localForage.setItem('user', {
          dictionary: null,
          ignoreRubies: null
        }).then((savedUser) => {
          this.user = savedUser
          return this
        })
      }
    })
  }

  async saveDictionary(newDictionary) {
    this.user.dictionary = newDictionary
    await localForage.setItem('user', _clone(this.user))
    return newDictionary
  }

  async saveIgnoreRubies(newIgnoreRubies) {
    this.user.ignoreRubies = newIgnoreRubies
    await localForage.setItem('user', _clone(this.user))
    return newIgnoreRubies
  }
}
