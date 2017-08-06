import _each from 'lodash/each'
import OptionsManager from 'OptionsManager'

$(() => {
  let om = new OptionsManager()
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
