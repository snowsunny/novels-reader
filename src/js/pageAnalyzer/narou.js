export default class Narou {
  constructor() {
    this.novelId = $('.contents1 .margin_r20').attr('href').replace(/\//g, '')
    this.novelName = $('.contents1 .margin_r20').text()

    const selectorArray = ['.novel_subtitle', '#novel_p p', '#novel_honbun p', '#novel_a p']
    this.readElements = {
      title: $(selectorArray[0]),
      foreword: $(selectorArray[1]),
      body: $(selectorArray[2]),
      afterword: $(selectorArray[3])
    }
    this.highlightElements = $(selectorArray.join(', '))
  }

  goToNext() {
    window.location.href = $('a.novelview_pager-next').prop('href')
  }
}