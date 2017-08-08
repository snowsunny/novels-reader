import _each from 'lodash/each'
import OptionsManager from 'OptionsManager'
import DictionariesManager from 'DictionariesManager'

$(() => {
  let om = new OptionsManager()
  let dm = new DictionariesManager()

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
      console.log(dictionary)
      $('.textarea[name=userDictionary]').val(dictionary.raw)
    } else {
      novelsDictionary.append(`<div class='button is-primary'>${dictionary.name}（${dictionary.id}）</div>`)
    }
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

  $('.textarea[name=userDictionary]').on('change', (e) => {
    dm.saveDictionary({
      id: 'user',
      raw: $(e.target).val(),
      rubies: dm.getRubiesObject($(e.target).val())
    })
  })
})
