import _merge from 'lodash/merge'
import Roudokuka from 'roudokuka'

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
      return checkIncludeRuby(splitRubyTagText) ? $(splitRubyTagText).find('rt').text() : splitRubyTagText
    }).join('')
    lineElement.data({readText: readText})
  }
  return lineElement
}

let lineIndex = 0
const getLineElements = (element) => {
  let splitTexts = element.html().split('<br>\n')

  let blankLineCount = 0
  return splitTexts.map((text) => {
    if(/\S/gi.test(text) == false) {
      blankLineCount++
    } else {
      let lineElement = getLineElement(text, blankLineCount, element)
      blankLineCount = 0
      return lineElement.prepend(`<div class='controll-button play' data-index='${lineIndex++}'></div>`)
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
chrome.runtime.sendMessage({method: 'getOptions', key: 'options'}, (response) => {
// console.log(response)
// start main --------

const options = response
$('head').append(`<style id='narou-reader-style'>
  .highlight {
    color: ${options.textColor == '' ? '#fff' : options.textColor};
    background-color: ${options.backgroundColor == '' ? '#498fd9' : options.backgroundColor};
  }

  .controll-button {
    color: ${$('#novel_color').css('color')};
    position: absolute;
    margin-top: ${($('#novel_honbun').css('line-height').replace('px', '') - $('#novel_honbun').css('font-size').replace('px', '')) / 2 }px;
    left: 50px;
    border: 1px solid;
    border-radius: 16px;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
  .controll-button:hover {
    background-color: #18b7cd;
  }
  p.include-ruby .controll-button {
    margin-top: 8px;
  }

  .controll-button.play:before {
    content: '▶';
    line-height: 16px;
    margin-left: 5px;
  }

  .controll-button.stop {
    position: fixed;
    top: ${$('#novel_header').height() + 15}px;
    left: 15px;
    width: 32px;
    height: 32px;
  }
  .controll-button.stop:before {
    content: '■';
    font-size: 19px;
    line-height: 31px;
    margin-left: 7px;
  }
</style>`)

const title = $('.novel_subtitle')
const foreword = $('#novel_p')
const body = $('#novel_honbun')
const afterword = $('#novel_a')

let lineElements = {}
let linesInfo = []

if(options.title == 'on' && title.length) {
  lineElements.title = [title.prepend(`<div class='controll-button play' data-index='${lineIndex++}'></div>`)]
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

$('.controll-button.play').on('click', (e) => {
  let targetPlayButton = $(e.currentTarget)
  lineUnHighlight()
  lineHighlight(targetPlayButton.parent())
  window.roudokuka.start(targetPlayButton.data().index)
})

$('body').append($(`<div class='controll-button stop'></div>`).click((e) => {
  window.roudokuka.stop()
}))

let roudokukaOptions = {}
if(options.rate != '') {
  roudokukaOptions.rate = Number(options.rate)
}
if(options.pitch != '') {
  roudokukaOptions.pitch = Number(options.pitch)
}
roudokukaOptions.onend = (e, lineInfo) => {
  lineUnHighlight()
  if(linesInfo[lineInfo.index + 1]) {
    let nextLineElement = linesInfo[lineInfo.index + 1].element
    lineHighlight(nextLineElement)
    if(options.autoScroll == 'on') {
      $('body').scrollTop(nextLineElement.offset().top - $(window).height() + nextLineElement.height() + 30)
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

// end main --------

})
}
