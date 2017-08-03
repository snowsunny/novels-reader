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

const getLineElements = (element) => {
  let splitTexts = element.html().split('<br>\n')

  let blankLineCount = 0
  return splitTexts.map((text) => {
    if(/\S/gi.test(text) == false) {
      blankLineCount++
    } else {
      let lineElement = getLineElement(text, blankLineCount, element)
      blankLineCount = 0
      return lineElement
    }
  }).filter((lineElement) => {
    return lineElement != undefined
  })
}

const lineHighlight = (lineElement) => {
  lineElement.addClass('highlight')
}

const lineUnHighlight = () => {
  $('#node_p p, #novel_honbun p, #node_a p').removeClass('highlight')
}


if($('#novel_honbun').length) {
chrome.runtime.sendMessage({method: 'getOptions', key: 'options'}, (response) => {
console.log(response)
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
    margin-top: 1px;
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

const foreword = $('#node_p')
const body = $('#novel_honbun')
const afterword = $('#node_a')

let lineElements = getLineElements(body)
let linesInfo = lineElements.map((lineElement) => {
  return {text: checkIncludeRuby(lineElement.html()) ? lineElement.data().readText : lineElement.text(), element: lineElement}
})

lineElements.forEach((lineElement, index) => {
  lineElement.prepend(`<div class='controll-button play' data-index='${index}'></div>`)
})
body.html(lineElements)

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
window.roudokuka = new Roudokuka(linesInfo, roudokukaOptions)

window.roudokuka.onReady().then(() => {
  lineHighlight(linesInfo[0].element)
  window.roudokuka.start()
})

// end main --------

})
}
