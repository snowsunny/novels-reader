export default class Narou {
  constructor() {
    // TODO: 短編対応
    this.novelId = window.location.href.split('/')[3]
    this.novelName = $('.contents1 [class*="margin"]').text() || $('#novel_contents .novel_title').text()

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