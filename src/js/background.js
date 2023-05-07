import OptionsManager from 'OptionsManager'
import DictionariesManager from 'DictionariesManager'
import UserManager from 'UserManager'
import _find from 'lodash/find'

chrome.runtime.onConnect.addListener(async (port) => {
  port.onMessage.addListener(async (request) => {
    switch(request.method) {
      case 'getOptions':
        let om = await new OptionsManager()
        port.postMessage(await om.getInitializedData())
        break

      case 'saveDictionary':
        let dm = await new DictionariesManager()
        let um = await new UserManager()

        port.postMessage({
          user: {
            dictionary: um.user.dictionary,
            ignoreRubies: um.user.ignoreRubies
          },
          currentNovelDictionary: await dm.saveDictionary(request.dictionary)
        })
        break

      default:
        port.postMessage(false)
    }
  })
})