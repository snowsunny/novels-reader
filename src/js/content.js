import _orderBy from 'lodash/orderBy'
import Roudokuka from 'roudokuka'
import pageAnalyzer from 'pageAnalyzer'
import initializeHead from 'initializer/head'

// global variables
let options = null
let dictionaries = null
let linesInfo = []
let voices = []
let analyzer = new pageAnalyzer(window.location.hostname)

const getLinesInfo = ($lineElements) => {
  let linesInfo = []
  $lineElements.each((index, lineElement) => {
    let $lineElement = $(lineElement)
    linesInfo.push({
      text: analyzer.checkIncludeRuby($lineElement.html()) ? $lineElement.data().readText : $lineElement.text(),
      element: $lineElement
    })
  })
  return linesInfo
}

const lineHighlight = (lineElement) => {
  lineElement.addClass('highlight')
}

const lineUnHighlight = () => {
  analyzer.module.highlightElements.removeClass('highlight')
}

const sendMessage = data => {
  return new Promise(resolve => {
    chrome.runtime.sendMessage(data, response => {
      resolve(response)
    })
  })
}

const initializeData = async () => {
  let roudokukaForGetData = new Roudokuka([''])
  await roudokukaForGetData.onReady().then(() => {
    voices = roudokukaForGetData.voices
  })

  options = await sendMessage({method: 'getOptions', key: 'options'})
  dictionaries = await sendMessage({
    method: 'saveDictionary',
    dictionary: {
      id: analyzer.module.novelId,
      name: analyzer.module.novelName
    }
  })

  for(let key in analyzer.module.readElements) {
    if(options[key] == 'on' && analyzer.module.readElements[key].length) {
      let filteredElements = analyzer.module.readElements[key].filter((index, element) => {
        return /\S/gi.test($(element).text())
      })
      analyzer.setPlayButtonElementsAndSetRubyData(filteredElements, dictionaries)
      linesInfo = linesInfo.concat(getLinesInfo(filteredElements))
    }
  }
  dictionaries = await sendMessage({
    method: 'saveDictionary',
    dictionary: {
      id: analyzer.module.novelId,
      raw: options.autoSaveDictionary == 'on' ? analyzer.getDictionaryText() : ''
    }
  })
}
initializeData().then(() => {
  initializeHead(options)

  let userRubies = dictionaries.user ? _orderBy(dictionaries.user.rubies, [r => r.rb.length], ['desc']) : false
  let novelRubies = dictionaries.novel.rubies.length ? _orderBy(dictionaries.novel.rubies, [r => r.rb.length], ['desc']) : false
  if(userRubies) {
    linesInfo.forEach((lineInfo) => {
      userRubies.forEach((ruby) => {
        if(!analyzer.checkIgnoreRubiesTest(ruby, dictionaries)) {
          lineInfo.text = lineInfo.text.trim().replace(RegExp(ruby.rb, 'gi'), ruby.rt)
        }
      })
    })
  }
  if(novelRubies) {
    linesInfo.forEach((lineInfo) => {
      novelRubies.forEach((ruby) => {
        if(!analyzer.checkIgnoreRubiesTest(ruby, dictionaries)) {
          lineInfo.text = lineInfo.text.trim().replace(RegExp(ruby.rb, 'gi'), ruby.rt)
        }
      })
    })
  }

  let roudokukaOptions = {}
  if(options.rate != undefined) {
    roudokukaOptions.rate = Number(options.rate)
  }
  if(options.pitch != undefined) {
    roudokukaOptions.pitch = Number(options.pitch)
  }
  if(options.volume != undefined) {
    roudokukaOptions.volume = Number(options.volume)
  }
  if(options.voiceType != undefined && options.voiceType != -1) {
    roudokukaOptions.voice = voices[options.voiceType]
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
      analyzer.module.goToNext()
    }
  }

  let roudokuka = new Roudokuka(linesInfo, roudokukaOptions)
  roudokuka.onReady().then(() => {
    if(options.autoPlay == 'on') {
      lineHighlight(linesInfo[0].element)
      roudokuka.start()
    }
  })

  $('.controll-button.play').on('click', (e) => {
    let targetPlayButton = $(e.currentTarget)
    lineUnHighlight()
    lineHighlight(targetPlayButton.parent())
    roudokuka.start(targetPlayButton.data().index)
  })

  $('body').append($(`<div class='controll-button stop'><i class='fa fa-stop-circle' aria-hidden='true'></div>`).click((e) => {
    roudokuka.stop()
  }))
})