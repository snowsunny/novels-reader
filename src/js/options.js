import _each from 'lodash/each'
import Roudokuka from 'roudokuka'
import OptionsManager from 'OptionsManager'
import DictionariesManager from 'DictionariesManager'

const om = new OptionsManager()
const dm = new DictionariesManager()

const saveDictionary = (element) => {
  let target = $(element)
  dm.saveDictionary({
    id: target.data().id,
    raw: target.val()
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

  let initOptions = om.getInitOptions()
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

  let novelsDictionary = $('#novels-dictionary')
  _each(dm.dictionaries, (dictionary) => {
    if(dictionary.id == 'user') {
      $('.textarea[data-id=user').val(dictionary.raw)
    } else if(dictionary.id == 'userIgnoreRubies') {
      $('.input[data-id=userIgnoreRubies').val(dictionary.raw)
    } else {
      let novelButton = $(`<div class='novels-button button is-primary'>${dictionary.name}（${dictionary.id}）</div>`).data('id', dictionary.id).click((e) => {
        let dictionary = dm.getDictionary($(e.currentTarget).data().id)
        $('#dictionary-modal-label').text(`${dictionary.name}（${dictionary.id}）`)
        $('#dictionary-modal-textarea').attr('data-id', dictionary.id).val(dictionary.raw)
        $('#dictionary-modal').addClass('is-active')
      })
      novelsDictionary.append(novelButton)
    }
  })

  $('#dictionary-modal .modal-background, #dictionary-modal button.delete, #dictionary-modal button.modal-close').on('click', () => {
    $('#dictionary-modal').removeClass('is-active')
  })

  $('.textarea.dictionary, .input.dictionary').on('change keyup', (e) => {
    saveDictionary(e.currentTarget)
  })

  $('.options input, .options select').on('change keyup', (e) => {
    let changedOptions = {}
    $('form.options').serializeArray().forEach((option) => {
      changedOptions[option.name] = option.value
    })
    om.saveOptions(changedOptions)
  })
})
