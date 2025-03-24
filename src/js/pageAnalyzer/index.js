import _find from 'lodash/find'
import { checkIncludeRuby, checkIncludeAnyTag, replaceReadableTextAnyTag, checkIgnoreRubiesTest } from 'pageAnalyzer/util'

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
    if(this.module.setReadTextData) {
      return this.dm.getDictionaryText(this.module.rubies)
    } else {
      return this.dm.getDictionaryText(this.rubies)
    }
  }

  checkIncludeRuby(html) {
    return checkIncludeRuby(html);
  }

  checkIgnoreRubiesTest(ruby, dataForRubies) {
    return checkIgnoreRubiesTest(ruby, dataForRubies);
  }

  setReadTextData($lineElement, dataForRubies) {
    let readText = null
    if(checkIncludeRuby($lineElement.html())) {
      const divider = '__|novels|reader|ruby|tag|divider|__'
      // FIXME: 普通にreplace((match) => {...})に変えた方が良いかな
      const splitRubyTagTexts = $lineElement.html().replace(/<ruby>/gi, `${divider}<ruby>`).replace(/<\/ruby>/gi, `</ruby>${divider}`).split(divider)
      readText = splitRubyTagTexts.map((splitRubyTagText) => {
        if(checkIncludeRuby(splitRubyTagText)) {
          const ruby = {
            rb: $(splitRubyTagText).find('rb').text(),
            rt: $(splitRubyTagText).find('rt').text()
          }
          ruby.text = $(splitRubyTagText).text().replace(ruby.rt, '')
          if(!_find(this.rubies, ruby) && !checkIgnoreRubiesTest(ruby, dataForRubies)) {
            this.rubies.push(ruby)
          }
          return checkIgnoreRubiesTest(ruby, dataForRubies)
            ? ruby.rb ? ruby.rb : ruby.text
            : ruby.rt
        } else {
          return replaceReadableTextAnyTag(splitRubyTagText)
        }
      }, this).join('')
    } else {
      if(checkIncludeAnyTag($lineElement.html())) {
        readText = replaceReadableTextAnyTag($lineElement.html())
      }
    }
    if(readText) {
      $lineElement.data({readText: readText})
    }
  }

  setPlayButtonElementsAndSetRubyData(lineElements, dataForRubies) {
    lineElements.each((index, lineElement) => {
      let $lineElement = $(lineElement)
      if(this.module.setReadTextData) {
        this.module.setReadTextData($lineElement, dataForRubies)
      } else {
        this.setReadTextData($lineElement, dataForRubies)
      }
      $lineElement.prepend($(`<div class='controll-button play' data-index='${this.lineIndex++}'><i class='fa fa-play-circle' aria-hidden='true'></div>`))
    })
  }
}