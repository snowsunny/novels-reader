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
  }

  goToNext() {
    window.location.href = $('a.c-pager__item--next').prop('href')
  }
}