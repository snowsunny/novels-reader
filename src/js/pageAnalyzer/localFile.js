export default class LocalFile {
  constructor() {
    this.novelId = document.querySelector('title').text
    this.novelName = this.novelId

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