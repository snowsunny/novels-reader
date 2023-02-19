import OptionsManager from 'OptionsManager'
import DictionariesManager from 'DictionariesManager'
import _find from 'lodash/find'


console.log(111, OptionsManager)

chrome.runtime.onConnect.addListener(async (port) => {
  console.log(222)
  port.onMessage.addListener(async (request) => {
    console.log(333, request)
    switch(request.method) {
      case 'getOptions':
        console.log(444, OptionsManager)
        let om = await new OptionsManager()
        console.log(om)
        port.postMessage(await om.getInitializedData())
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