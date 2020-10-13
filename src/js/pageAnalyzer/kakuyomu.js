export default class Kakuyomu {
  constructor() {
    this.novelId = $('#worksEpisodesEpisodeHeader-breadcrumbs h1 a').attr('href').replace(/\/works\//g, '')
    this.novelName = $('#worksEpisodesEpisodeHeader-breadcrumbs h1').text()

    const selectorArray = ['.widget-episodeTitle', null, '.widget-episodeBody p', null]
    this.readElements = {
      title: $(selectorArray[0]),
      foreword: $(selectorArray[1]),
      body: $(selectorArray[2]),
      afterword: $(selectorArray[3])
    }
    // this.highlightElements = $(selectorArray.join(', '))
    this.highlightElements = $('.widget-episodeTitle, .widget-episodeBody p')
  }

  goToNext() {
    let nextUrl = $('#contentMain-nextEpisode a').attr('href')
    if(nextUrl) {
      window.location.href = nextUrl
    }
  }
}