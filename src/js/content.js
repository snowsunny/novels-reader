import _find from 'lodash/find'
import _orderBy from 'lodash/orderBy'
import Roudokuka from 'roudokuka'

// global variables
let options = undefined
let dictionaries = undefined
let rubies = []
let lineIndex = 0

const getDictionaryText = (rubies) => {
  let dictionaryText = ''
  rubies.forEach((ruby) => {
    dictionaryText += `${ruby.rb}::${ruby.rt}\n`
  })
  return dictionaryText.trim()
}

const checkIncludeRuby = (text) => {
  return /<ruby><rb>/gi.test(text)
}

const checkIgnoreRubiesTest = (ruby) => {
  return dictionaries.ignoreRubies && dictionaries.ignoreRubies.raw && RegExp(dictionaries.ignoreRubies.raw, 'gi').test(ruby.rt)
}

const setRubyData = ($lineElement) => {
  if(checkIncludeRuby($lineElement.html())) {
    $lineElement.addClass('include-ruby')

    const divider = '__|novels|reader|ruby|tag|divider|__'
    const splitRubyTagTexts = $lineElement.html().replace(/<ruby><rb>/gi, `${divider}<ruby><rb>`).replace(/<\/rp><\/ruby>/gi, `</rp></ruby>${divider}`).split(divider)
    const readText = splitRubyTagTexts.map((splitRubyTagText) => {
      if(checkIncludeRuby(splitRubyTagText)) {
        const ruby = {rb: $(splitRubyTagText).find('rb').text(), rt: $(splitRubyTagText).find('rt').text()}
        if(!_find(rubies, ruby) && !checkIgnoreRubiesTest(ruby)) {
          rubies.push(ruby)
        }
        return checkIgnoreRubiesTest(ruby)
          ? ruby.rb
          : ruby.rt
      } else {
        return splitRubyTagText
      }
    }).join('')
    $lineElement.data({readText: readText})
  }
}

const setPlayButtonElementsAndSetRubyData = (lineElements) => {
  lineElements.each((index, lineElement) => {
    let $lineElement = $(lineElement)
    setRubyData($lineElement)
    $lineElement.prepend($(`<div class='controll-button play' data-index='${lineIndex++}'><i class='fa fa-play-circle' aria-hidden='true'></div>`))
  })
}

const getLinesInfo = ($lineElements) => {
  let linesInfo = []
  $lineElements.each((index, lineElement) => {
    let $lineElement = $(lineElement)
    linesInfo.push({
      text: checkIncludeRuby($lineElement.html()) ? $lineElement.data().readText : $lineElement.text(),
      element: $lineElement
    })
  })
  return linesInfo
}

const lineHighlight = (lineElement) => {
  lineElement.addClass('highlight')
}

const lineUnHighlight = () => {
  $('.novel_subtitle, #novel_p p, #novel_honbun p, #novel_a p').removeClass('highlight')
}

if($('#novel_honbun').length) {
  const novelId = $('.contents1 .margin_r20').attr('href').replace(/\//g, '')
  chrome.runtime.sendMessage({method: 'getOptions', key: 'options'}, (responseOptions) => {
    chrome.runtime.sendMessage({method: 'saveDictionary', dictionary: {
      id: novelId,
      name: $('.contents1 .margin_r20').text()
    }}, (responseDictionaries) => {

// start main --------

options = responseOptions
dictionaries = responseDictionaries

$('head').append(`<link href='https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css' rel='stylesheet' integrity='sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN' crossorigin='anonymous'>`)
$('head').append(`<style id='novels-reader-style'>
  .highlight {
    color: ${options.textColor == undefined ? '#fff' : options.textColor};
    background-color: ${options.backgroundColor == undefined ? '#498fd9' : options.backgroundColor};
  }

  .controll-button {
    color: ${$('#novel_color').css('color')};
    position: absolute;
    cursor: pointer;
  }
  .controll-button:hover {
    color: #18b7cd;
  }

  .controll-button .fa {
    line-height: inherit;
    font-size: 120%;
  }

  p.include-ruby .controll-button .fa {
    margin-top: ${$('ruby rt').height()}px;
    line-height: ${$('ruby rb').height()}px;
  }

  .controll-button.play {
    margin-left: -25px;
  }
  .controll-button.stop {
    position: fixed;
    top: ${$('#novel_header').height() + 15}px;
    left: 15px;
    font-size: 30px;
  }
</style>`)

let lineElements = {}
let linesInfo = []

const targetElements = {
  title: $('.novel_subtitle'),
  foreword: $('#novel_p p'),
  body: $('#novel_honbun p'),
  afterword: $('#novel_a p')
}
for(let key in targetElements) {
  if(options[key] == 'on' && targetElements[key].length) {
    let filteredElements = targetElements[key].filter((index, element) => {
      return /\S/gi.test($(element).text())
    })
    setPlayButtonElementsAndSetRubyData(filteredElements)
    linesInfo = linesInfo.concat(getLinesInfo(filteredElements))
  }
}

chrome.runtime.sendMessage({method: 'saveDictionary', dictionary: {
  id: novelId,
  raw: options.autoSaveDictionary == 'on' ? getDictionaryText(rubies) : ''
}}, (savedDictionary) => {
dictionaries = savedDictionary

let userRubies = dictionaries.user ? _orderBy(dictionaries.user.rubies, [function(r) { return r.rb.length; }], ['desc']) : false
let novelRubies = dictionaries.novel.rubies.length ? _orderBy(dictionaries.novel.rubies, [function(r) { return r.rb.length; }], ['desc']) : false
if(userRubies) {
  linesInfo.forEach((lineInfo) => {
    userRubies.forEach((ruby) => {
      if(!checkIgnoreRubiesTest(ruby)) {
        lineInfo.text = lineInfo.text.trim().replace(RegExp(ruby.rb, 'gi'), ruby.rt)
      }
    })
  })
}
if(novelRubies) {
  linesInfo.forEach((lineInfo) => {
    novelRubies.forEach((ruby) => {
      if(!checkIgnoreRubiesTest(ruby)) {
        lineInfo.text = lineInfo.text.trim().replace(RegExp(ruby.rb, 'gi'), ruby.rt)
      }
    })
  })
}

$('.controll-button.play').on('click', (e) => {
  let targetPlayButton = $(e.currentTarget)
  lineUnHighlight()
  lineHighlight(targetPlayButton.parent())
  window.roudokuka.start(targetPlayButton.data().index)
})

$('body').append($(`<div class='controll-button stop'><i class='fa fa-stop-circle' aria-hidden='true'></div>`).click((e) => {
  window.roudokuka.stop()
}))

let roudokukaOptions = {}
if(options.rate != undefined) {
  roudokukaOptions.rate = Number(options.rate)
}
if(options.pitch != undefined) {
  roudokukaOptions.pitch = Number(options.pitch)
}
roudokukaOptions.onend = (e, lineInfo) => {
  lineUnHighlight()
  if(linesInfo[lineInfo.index + 1]) {
    let nextLineElement = linesInfo[lineInfo.index + 1].element
    lineHighlight(nextLineElement)
    if(options.autoScroll == 'on') {
      $('html').scrollTop(nextLineElement.offset().top - $(window).height() / 2 + nextLineElement.height() / 2)
    }
  }
}
roudokukaOptions.onLibrettoEnd = () => {
  if(options.autoMoveNext == 'on') {
    $($('.novel_bn')[0]).children().each((index, element) => {
      element = $(element)
      if(/>>/.test(element.text())) {
        window.location.href = element.prop('href')
      }
    })
  }
}
window.roudokuka = new Roudokuka(linesInfo, roudokukaOptions)

window.roudokuka.onReady().then(() => {
  if(options.autoPlay == 'on') {
    lineHighlight(linesInfo[0].element)
    window.roudokuka.start()
  }
})

})
// end main --------

    })
  })
}
