import _assign from 'lodash/assign'
import _find from 'lodash/find'
import narou from 'pageAnalyzer/narou'

export default class PageAnalyzer {
  constructor(hostname) {
    this.modules = [new narou]
    this.module = this.getTargetModule(hostname)
    this.lineIndex = 0
    this.rubies = []
  }

  getDictionaryText() {
    let dictionaryText = ''
    this.rubies.forEach((ruby) => {
      dictionaryText += `${ruby.rb}::${ruby.rt}\n`
    })
    return dictionaryText.trim()
  }

  getTargetModule(hostname) {
    let targetModule = null
    this.modules.forEach(module => {
      if(hostname === module.targetHostname) {
        targetModule = module
      }
    })
    return targetModule
  }

  checkIncludeRuby(text) {
    return /<ruby><rb>/gi.test(text)
  }

  checkIgnoreRubiesTest(ruby, dictionaries) {
    return dictionaries.ignoreRubies && dictionaries.ignoreRubies.raw && RegExp(dictionaries.ignoreRubies.raw, 'gi').test(ruby.rt)
  }

  setRubyData($lineElement, dictionaries) {
    if(this.checkIncludeRuby($lineElement.html())) {
      $lineElement.addClass('include-ruby')

      const divider = '__|novels|reader|ruby|tag|divider|__'
      const splitRubyTagTexts = $lineElement.html().replace(/<ruby><rb>/gi, `${divider}<ruby><rb>`).replace(/<\/rp><\/ruby>/gi, `</rp></ruby>${divider}`).split(divider)
      const readText = splitRubyTagTexts.map((splitRubyTagText) => {
        if(this.checkIncludeRuby(splitRubyTagText)) {
          const ruby = {rb: $(splitRubyTagText).find('rb').text(), rt: $(splitRubyTagText).find('rt').text()}
          if(!_find(this.rubies, ruby) && !this.checkIgnoreRubiesTest(ruby, dictionaries)) {
            this.rubies.push(ruby)
          }
          return this.checkIgnoreRubiesTest(ruby, dictionaries)
            ? ruby.rb
            : ruby.rt
        } else {
          return splitRubyTagText
        }
      }, this).join('')
      $lineElement.data({readText: readText})
    }
  }

  setPlayButtonElementsAndSetRubyData(lineElements, dictionaries) {
    lineElements.each((index, lineElement) => {
      let $lineElement = $(lineElement)
      this.setRubyData($lineElement, dictionaries)
      $lineElement.prepend($(`<div class='controll-button play' data-index='${this.lineIndex++}'><i class='fa fa-play-circle' aria-hidden='true'></div>`))
    })
  }
}