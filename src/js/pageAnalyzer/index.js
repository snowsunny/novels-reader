import _find from 'lodash/find'
import DictionariesManager from 'DictionariesManager'
import Narou from 'pageAnalyzer/narou'
import Kakuyomu from 'pageAnalyzer/kakuyomu'
import LocalFile from 'pageAnalyzer/localFile'

export default class PageAnalyzer {
  constructor(domain) {
    const moduleData = {
      'ncode.syosetu.com': Narou,
      'novel18.syosetu.com': Narou,
      'kakuyomu.jp': Kakuyomu,
      'localFile': LocalFile
    }
    this.module = new moduleData[domain]

    this.domain = domain
    this.lineIndex = 0
    this.rubies = []

    this.dm = null
    return (new DictionariesManager).then((dm) => {
      this.dm = dm
      return this
    })
  }

  getDictionaryTextOfCurrentNovelPage() {
    return this.dm.getDictionaryText(this.rubies)
  }

  checkIncludeRuby(text) {
    return /<ruby>/gi.test(text)
  }

  checkIncludeAnyTag(text) {
    return /<.*>.*<\/.*>/.test(text)
  }
  replaceReadableTextAnyTag(text) {
    while(this.checkIncludeAnyTag(text)) {
      text = text.replace(/<.*>.*<\/.*>/, (match) => $(match).text())
    }
    return text
  }

  checkIgnoreRubiesTest(ruby, dataForRubies) {
    return dataForRubies.user.ignoreRubies && RegExp(dataForRubies.user.ignoreRubies, 'gi').test(ruby.rt)
  }

  setReadTextData($lineElement, dataForRubies) {
    let readText = null
    if(this.checkIncludeRuby($lineElement.html())) {
      const divider = '__|novels|reader|ruby|tag|divider|__'
      // FIXME: 普通にreplace((match) => {...})に変えた方が良いかな
      const splitRubyTagTexts = $lineElement.html().replace(/<ruby>/gi, `${divider}<ruby>`).replace(/<\/ruby>/gi, `</ruby>${divider}`).split(divider)
      readText = splitRubyTagTexts.map((splitRubyTagText) => {
        if(this.checkIncludeRuby(splitRubyTagText)) {
          const ruby = {rb: $(splitRubyTagText).find('rb').text(), rt: $(splitRubyTagText).find('rt').text()}
          ruby.text = $(splitRubyTagText).text().replace(ruby.rt, '')
          if(!_find(this.rubies, ruby) && !this.checkIgnoreRubiesTest(ruby, dataForRubies)) {
            this.rubies.push(ruby)
          }
          return this.checkIgnoreRubiesTest(ruby, dataForRubies)
            ? ruby.rb ? ruby.rb : ruby.text
            : ruby.rt
        } else {
          return this.replaceReadableTextAnyTag(splitRubyTagText)
        }
      }, this).join('')
    } else {
      if(this.checkIncludeAnyTag($lineElement.html())) {
        readText = this.replaceReadableTextAnyTag($lineElement.html())
      }
    }
    if(readText) {
      $lineElement.data({readText: readText})
    }
  }

  setPlayButtonElementsAndSetRubyData(lineElements, dataForRubies) {
    lineElements.each((index, lineElement) => {
      let $lineElement = $(lineElement)
      this.setReadTextData($lineElement, dataForRubies)
      $lineElement.prepend($(`<div class='controll-button play' data-index='${this.lineIndex++}'><i class='fa fa-play-circle' aria-hidden='true'></div>`))
    })
  }
}