import _each from 'lodash/each'
import OptionsManager from 'OptionsManager'
import DictionariesManager from 'DictionariesManager'

let om = new OptionsManager()
let dm = new DictionariesManager()

const saveDictionary = (element) => {
  let target = $(element)
  dm.saveDictionary({
    id: 'user',
    raw: target.val(),
    rubies: dm.getRubiesObject(target.val())
  })
}

$(() => {
  let initOptions = om.getInitOptions()
  _each(initOptions, (value, key) => {
    let targetInput = $(`#options input[name=${key}]`)
    if(targetInput.attr('type') == 'checkbox') {
      if(value == 'on') {
        targetInput.prop('checked', true)
      }
    } else {
      targetInput.val(value)
    }
  })

  let novelsDictionary = $('#novels-dictionary')
  _each(dm.dictionaries, (dictionary) => {
    if(dictionary.id == 'user') {
      $('.textarea[name=userDictionary]').val(dictionary.raw)
    } else {
      let novelButton = $(`<div class='novels-button button is-primary'>${dictionary.name}（${dictionary.id}）</div>`).data('id', dictionary.id).click((e) => {
        let dictionary = dm.getDictionary($(e.currentTarget).data().id)
        $('#dictionary-modal-label').text(`${dictionary.name}（${dictionary.id}）`)
        $('#dictionary-modal-textarea').val(dictionary.raw)
        $('#dictionary-modal').addClass('is-active').attr('data-id', dictionary.id)
      })
      novelsDictionary.append(novelButton)
    }
  })

  $('#dictionary-modal .modal-background, #dictionary-modal button.delete, #dictionary-modal button.modal-close').on('click', () => {
    $('#dictionary-modal').removeClass('is-active')
  })

  $('.textarea[name=userDictionary]').on('change', (e) => {
    saveDictionary(e.currentTarget)
  })
  $('#dictionary-modal-textarea').on('change', (e) => {
    saveDictionary(e.currentTarget)
  })

  $('#options input').on('change', (e) => {
    let changedOptions = {}
    $('#options').serializeArray().filter((option) => {
      return option.value != ''
    }).forEach((option) => {
      changedOptions[option.name] = option.value
    })
    om.saveOptions(changedOptions)
  })
})
