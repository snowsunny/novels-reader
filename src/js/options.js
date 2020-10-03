import _each from 'lodash/each'
import Roudokuka from 'roudokuka'
import OptionsManager from 'OptionsManager'
import DictionariesManager from 'DictionariesManager'

let om = null
let dm = null

const saveDictionaryForOptionPage = async (element) => {
  let $target = $(element)
  await dm.saveDictionary({
    ...$target.data(),
    raw: $target.val()
  }, true)
}

$(async () => {
  let roudokuka = new Roudokuka([''])
  await roudokuka.onReady().then(() => {
    roudokuka.voices.forEach((voice, i) => {
      $('.options select[name=voiceType]').append(
        `<option value="${i}">${voice.name} / ${voice.lang}</option>`
      )
    })
  })

  om = await new OptionsManager()
  let initOptions = await om.getInitOptions()
  $('.hero.is-primary .title').append(initOptions.version)
  _each(initOptions, (value, key) => {
    switch(key) {
      case 'voiceType':
        if(value !== '-1') {
          $('.options select[name=voiceType] option').each((i, option) => {
            if($(option).attr('value') == value) {
              $(option).prop('selected', true)
            }
          })
        }
        break

      default:
        let targetForm = $(`.options input[name=${key}]`)
        if(targetForm.length) {
          switch(targetForm.attr('type')) {
            case 'checkbox':
              if(value == 'on') {
                targetForm.prop('checked', true)
              }
              break

            default:
              targetForm.val(value)
              break
          }
        }
        break
    }
  })

  dm = await new DictionariesManager()
  let novelsDictionary = $('#novels-dictionary')
  _each([...dm.dictionaries].reverse(), (dictionary) => {
    if(dictionary.id == 'user') {
      $('.textarea[data-id=user').val(dictionary.raw)
    } else if(dictionary.id == 'userIgnoreRubies') {
      $('.input[data-id=userIgnoreRubies').val(dictionary.raw)
    } else {
      let novelButton = $(`<div class='column is-flex is-3-desktop is-4-tablet'><div class='novel-name-wrap is-flex'><div class='novel-name'>${dictionary.name}（${dictionary.id}）</div></div></div>`)
      novelButton.find('.novel-name-wrap').data({id: dictionary.id, domain: dictionary.domain}).on('click', (e) => {
        let dictionary = dm.getDictionary($(e.currentTarget).data())
        $('#dictionary-modal-label').text(`${dictionary.name}（${dictionary.id}）`)
        $('#dictionary-modal-textarea').data({id: dictionary.id, domain: dictionary.domain}).val(dictionary.raw)
        $('#dictionary-modal').addClass('is-active')
      })
      novelsDictionary.append(novelButton)
    }
  })

  $('#dictionary-modal .modal-background, #dictionary-modal button.delete, #dictionary-modal button.modal-close').on('click', () => {
    $('#dictionary-modal').removeClass('is-active')
  })

  $('.textarea.dictionary, .input.dictionary').on('change keyup', (e) => {
    saveDictionaryForOptionPage(e.currentTarget)
  })

  $('.options input, .options select').on('change keyup', async (e) => {
    let changedOptions = {}
    $('form.options').serializeArray().forEach((option) => {
      changedOptions[option.name] = option.value
    })
    await om.saveOptions(changedOptions)
  })

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
