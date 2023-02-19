import _each from 'lodash/each'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import useSharedStore from 'stores/shared'
import App from 'components/options.vue'

const app = createApp(App).use(createPinia())
$(async () => {
  await useSharedStore().init()
  app.mount('#app')

  // export & import --------
  $('#export-panel .button').on('click', async (e) => {
    let exportData = {}
    if($('#export-panel input[name="options"]').prop('checked')) {
      exportData.options = await om.getInitOptions()
    }
    if($('#export-panel input[name="dictionaries"]').prop('checked')) {
      exportData.dictionaries = await dm.getDictionaries()
    }
    await navigator.clipboard.writeText(JSON.stringify(exportData))
  })

  $('#import-panel .button').on('click', async (e) => {
    let reloadFlag = false
    let importData = $('#import-panel textarea').val()
    if(importData) {
      importData = JSON.parse(importData)
    }
    if(importData.options) {
      reloadFlag = true
      await om.saveOptions(importData.options)
    }
    if(importData.dictionaries) {
      reloadFlag = true
      let importingData = []
      importData.dictionaries.forEach((dictionary) => {
        if(dictionary.id === 'userIgnoreRubies') {
          importingData.push(dm.saveDictionary(dictionary, true))
        } else if($('#import-panel input[name="newRubiesOnly"]').prop('checked')) {
          importingData.push(dm.saveDictionary(dictionary))
        } else {
          importingData.push(dm.saveDictionary(dictionary, true))
        }
      })
      await Promise.all(importingData)
    }
    if(reloadFlag) {
      location.reload()
    }
  })
})
