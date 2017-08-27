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

const getLineElement = (text, blankLineCount, element) => {
  let lineElement = $(`<p style='margin-top: ${blankLineCount * element.css('line-height').replace('px', '')}px'>${text}</p>`)
  if(checkIncludeRuby(text)) {
    lineElement.addClass('include-ruby')

    const divider = '__|narou|reader|ruby|tag|divider|__'
    const splitRubyTagTexts = text.replace(/<ruby><rb>/gi, `${divider}<ruby><rb>`).replace(/<\/rp><\/ruby>/gi, `</rp></ruby>${divider}`).split(divider)
    const readText = splitRubyTagTexts.map((splitRubyTagText) => {
      if(checkIncludeRuby(splitRubyTagText)) {
        const ruby = {rb: $(splitRubyTagText).find('rb').text(), rt: $(splitRubyTagText).find('rt').text()}
        if(!_find(rubies, ruby)) {
          rubies.push(ruby)
        }
        // TODO: ここに無視する読みの処理を入れる
        return ruby.rb
      } else {
        return splitRubyTagText
      }
    }).join('')
    lineElement.data({readText: readText})
  }
  return lineElement
}

const getLineElements = (element) => {
  let splitTexts = element.html().split('<br>\n')

  let blankLineCount = 0
  return splitTexts.map((text) => {
    if(/\S/gi.test(text) == false) {
      blankLineCount++
    } else {
      let lineElement = getLineElement(text, blankLineCount, element)
      blankLineCount = 0
      return lineElement.prepend(`<div class='controll-button play' data-index='${lineIndex++}'><i class='fa fa-play-circle' aria-hidden='true'></div>`)
    }
  }).filter((lineElement) => {
    return lineElement != undefined
  })
}

const getLinesInfo = (lineElements) => {
  return lineElements.map((lineElement) => {
    return {text: checkIncludeRuby(lineElement.html()) ? lineElement.data().readText : lineElement.text(), element: lineElement}
  })
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
$('head').append(`<style id='narou-reader-style'>
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

const title = $('.novel_subtitle')
const foreword = $('#novel_p')
const body = $('#novel_honbun')
const afterword = $('#novel_a')

let lineElements = {}
let linesInfo = []

if(options.title == 'on' && title.length) {
  lineElements.title = [title.prepend(`<div class='controll-button play' data-index='${lineIndex++}'><i class='fa fa-play-circle' aria-hidden='true'></i></div>`)]
  linesInfo = linesInfo.concat(getLinesInfo(lineElements.title))
}
if(options.foreword == 'on' && foreword.length) {
  lineElements.foreword = getLineElements(foreword)
  linesInfo = linesInfo.concat(getLinesInfo(lineElements.foreword))
  foreword.html(lineElements.foreword)
}
if(options.body == 'on' && body.length) {
  lineElements.body = getLineElements(body)
  linesInfo = linesInfo.concat(getLinesInfo(lineElements.body))
  body.html(lineElements.body)
}
if(options.afterword == 'on' && afterword.length) {
  lineElements.afterword = getLineElements(afterword)
  linesInfo = linesInfo.concat(getLinesInfo(lineElements.afterword))
  afterword.html(lineElements.afterword)
}


chrome.runtime.sendMessage({method: 'saveDictionary', dictionary: {
  id: novelId,
  raw: getDictionaryText(rubies)
}}, (savedDictionary) => {
dictionaries = savedDictionary

let userRubies = dictionaries.user ? _orderBy(dictionaries.user.rubies, [function(r) { return r.rb.length; }], ['desc']) : false
let novelRubies = dictionaries.novel.rubies.length ? _orderBy(dictionaries.novel.rubies, [function(r) { return r.rb.length; }], ['desc']) : false
if(userRubies) {
  linesInfo.forEach((lineInfo) => {
    userRubies.forEach((ruby) => {
      lineInfo.text = lineInfo.text.replace(RegExp(ruby.rb, 'gi'), ruby.rt)
    })
  })
}
if(novelRubies) {
  linesInfo.forEach((lineInfo) => {
    novelRubies.forEach((ruby) => {
      lineInfo.text = lineInfo.text.replace(RegExp(ruby.rb, 'gi'), ruby.rt)
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
      $('body').scrollTop(nextLineElement.offset().top - $(window).height() / 2 + nextLineElement.height() / 2)
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
