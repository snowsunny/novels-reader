export default class LocalFile {
  constructor() {
    this.novelId = location.href
    this.novelName = document.querySelector('title').text

    const selectorArray = ['p']
    this.readElements = {
      body: $(selectorArray[0]),
    }
    this.highlightElements = $(selectorArray.join(', '))
  }

  goToNext() {
    console.log('終')
  }
}