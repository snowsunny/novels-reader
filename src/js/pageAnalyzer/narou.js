export default class Narou {
  constructor() {
    this.targetHostname = 'ncode.syosetu.com'
    this.novelId = $('.contents1 .margin_r20').attr('href').replace(/\//g, '')
    this.novelName = $('.contents1 .margin_r20').text()

    const elementArray = ['.novel_subtitle', '#novel_p p', '#novel_honbun p', '#novel_a p']
    this.readElements = {
      title: $(elementArray[0]),
      foreword: $(elementArray[1]),
      body: $(elementArray[2]),
      afterword: $(elementArray[3])
    }
    this.highlightElements = $(elementArray.join(', '))

    this.goToNext = () => {
      $($('.novel_bn')[0]).children().each((index, element) => {
        element = $(element)
        if(/>>/.test(element.text())) {
          window.location.href = element.prop('href')
        }
      })
    }
  }
}