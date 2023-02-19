import _orderBy from 'lodash/orderBy'
import Roudokuka from 'roudokuka'
import pageAnalyzer from 'pageAnalyzer'
import initializeHead from 'initializer/head'
import DictionariesManager from 'DictionariesManager'
console.log(111)
// global variables
let options = null
let dictionaries = null
let linesInfo = []
let voices = null
let analyzer = null
let dm = null

const getLinesInfo = ($lineElements) => {
  let data = []
  $lineElements.each((index, lineElement) => {
    let $lineElement = $(lineElement)
    data.push({
      text: analyzer.checkIncludeRuby($lineElement.html()) ? $lineElement.data().readText : $lineElement.text(),
      element: $lineElement
    })
  })
  return data
}

const cleanLinesInfoAndRemovePlayButton = (linesInfo) => {
  return linesInfo.filter(lineInfo => {
    if(lineInfo.text) {
      return true
    } else {
      lineInfo.element.find('.controll-button, .play').remove()
      return false
    }
  }).map((lineInfo, index) => {
    lineInfo.element.find('.controll-button, .play').attr('data-index', index)
    return lineInfo
  })
}

const lineHighlight = (lineElement) => {
  lineElement.addClass('highlight')
}

const lineUnHighlight = () => {
  analyzer.module.highlightElements.removeClass('highlight')
}

const connectPort = chrome.runtime.connect({name: 'novels-reader'})
const postMessage = data => {
  return new Promise(resolve => {
    const callback = response => {
      connectPort.onMessage.removeListener(callback)
      resolve(response)
    }
    connectPort.onMessage.addListener(callback)
    connectPort.postMessage(data)
  })
}

const initializeData = async () => {
  let roudokukaForGetVoicesData = new Roudokuka([''])
  await roudokukaForGetVoicesData.onReady().then(() => {
    voices = roudokukaForGetVoicesData.voices
  })

  dm = await new DictionariesManager()

  if(/file:\/\/|content:\/\//.test(window.location.href)) {
    analyzer = await new pageAnalyzer('localFile')
  } else {
    analyzer = await new pageAnalyzer(window.location.hostname)
  }
  let findDictionaryOption = {id: analyzer.module.novelId, domain: analyzer.domain}

  console.log(222)
  options = await postMessage({method: 'getOptions', key: 'options'})
  console.log(333,options)
  dictionaries = await postMessage({
    method: 'saveDictionary',
    dictionary: {
      ...findDictionaryOption,
      name: analyzer.module.novelName
    }
  })

  for(let key in analyzer.module.readElements) {
    if(options.readSections[key] && analyzer.module.readElements[key].length) {
      let filteredElements = analyzer.module.readElements[key].filter((index, element) => {
        return /\S/gi.test($(element).text())
      })
      analyzer.setPlayButtonElementsAndSetRubyData(filteredElements, dictionaries)
      linesInfo = linesInfo.concat(getLinesInfo(filteredElements))
    }
  }
  dictionaries = await postMessage({
    method: 'saveDictionary',
    dictionary: {
      ...findDictionaryOption,
      raw: options.autoSaveDictionary ? analyzer.getDictionaryTextOfCurrentNovelPage() : ''
    }
  })
}
initializeData().then(() => {
  initializeHead(options)

  let userRubies = dictionaries.user ? _orderBy(dm.getRubies(dictionaries.user.raw), [r => r.rb.length], ['desc']) : false
  if(userRubies.length) {
    linesInfo.forEach((lineInfo) => {
      userRubies.forEach((ruby) => {
        if(!analyzer.checkIgnoreRubiesTest(ruby, dictionaries)) {
          lineInfo.text = lineInfo.text.trim().replace(RegExp(ruby.rb, 'gi'), ruby.rt)
        }
      })
    })
    linesInfo = cleanLinesInfoAndRemovePlayButton(linesInfo)
  }

  let novelRubies = dm.getRubies(dictionaries.novel.raw)
  novelRubies = novelRubies.length ? _orderBy(novelRubies, [r => r.rb.length], ['desc']) : false
  if(novelRubies.length) {
    linesInfo.forEach((lineInfo) => {
      novelRubies.forEach((ruby) => {
        if(!analyzer.checkIgnoreRubiesTest(ruby, dictionaries)) {
          lineInfo.text = lineInfo.text.trim().replace(RegExp(ruby.rb, 'gi'), ruby.rt)
        }
      })
    })
    linesInfo = cleanLinesInfoAndRemovePlayButton(linesInfo)
  }

  let roudokukaOptions = {}
  if(options.voice.rate != undefined && options.voice.rate != '') {
    roudokukaOptions.rate = Number(options.voice.rate)
  }
  if(options.voice.pitch != undefined && options.voice.pitch != '') {
    roudokukaOptions.pitch = Number(options.voice.pitch)
  }
  if(options.voice.volume != undefined && options.voice.volume != '') {
    roudokukaOptions.volume = Number(options.voice.volume)
  }
  if(options.voice.index != undefined && options.voice.index != -1) {
    roudokukaOptions.voice = voices[options.voice.index]
  }
  roudokukaOptions.onend = (e, lineInfo) => {
    lineUnHighlight()
    if(linesInfo[lineInfo.index + 1]) {
      let nextLineElement = linesInfo[lineInfo.index + 1].element
      lineHighlight(nextLineElement)
      if(options.autoScroll == 'on') {
        $('body').scrollTop(nextLineElement.offset().top - window.innerHeight / 2 + nextLineElement.height() / 2)
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