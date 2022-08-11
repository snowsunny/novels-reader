import OptionsManager from 'OptionsManager'
import DictionariesManager from 'DictionariesManager'
import _find from 'lodash/find'

chrome.runtime.onConnect.addListener(async (port) => {
  port.onMessage.addListener(async (request) => {
    switch(request.method) {
      case 'getOptions':
        let om = await new OptionsManager()
        port.postMessage(await om.getInitOptions())
        break

      case 'saveDictionary':
        let dm = await new DictionariesManager()
        port.postMessage({
          user: _find(dm.dictionaries, {id: 'user'}),
          ignoreRubies: _find(dm.dictionaries, {id: 'userIgnoreRubies'}),
          novel: await dm.saveDictionary(request.dictionary)
        })
        break

      default:
        port.postMessage(false)
    }
  })
})