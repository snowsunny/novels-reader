import _find from 'lodash/find'
import { checkIncludeRuby, checkIncludeAnyTag, checkIgnoreRubiesTest, replaceReadableTextAnyTag } from 'pageAnalyzer/util'

export default class Narou {
  constructor() {
    // TODO: 短編対応
    this.novelId = window.location.href.split('/')[3]

    // 本文ページか作品トップページでのタイトル取得
    this.novelName = $('.c-announce:not([class*=" "]) a:first-child').text() || $('.p-novel__title').text()

    const selectorArray = ['.p-novel__title--rensai', '.p-novel__text--preface p', '.p-novel__text:not(.p-novel__text--preface, .p-novel__text--afterword) p', '.p-novel__text--afterword p']
    this.readElements = {
      title: $(selectorArray[0]),
      foreword: $(selectorArray[1]),
      body: $(selectorArray[2]),
      afterword: $(selectorArray[3])
    }
    this.highlightElements = $(selectorArray.join(', '))

    this.rubies = []
  }

  goToNext() {
    window.location.href = $('a.c-pager__item--next').prop('href')
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
            rb: null,
            rt: $(splitRubyTagText).find('rt').text(),
            rp: $(splitRubyTagText).find('rp').text()
          }
          ruby.rb = $(splitRubyTagText).text().replace(new RegExp(`[${ruby.rt}${ruby.rp}]`, 'g'), '')

          if(!_find(this.rubies, ruby) && !checkIgnoreRubiesTest(ruby, dataForRubies)) {
            this.rubies.push(ruby)
          }
          return checkIgnoreRubiesTest(ruby, dataForRubies) ? ruby.rb : ruby.rt
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
}