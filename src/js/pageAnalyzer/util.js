function checkIncludeRuby(text) {
  return /<ruby>/gi.test(text)
}

function checkIncludeAnyTag(text) {
  return /<.*>.*<\/.*>/.test(text)
}
function replaceReadableTextAnyTag(text) {
  while(checkIncludeAnyTag(text)) {
    text = text.replace(/<.*>.*<\/.*>/, (match) => $(match).text())
  }
  return text
}

function checkIgnoreRubiesTest(ruby, dataForRubies) {
  return dataForRubies.user.ignoreRubies && RegExp(dataForRubies.user.ignoreRubies, 'gi').test(ruby.rt)
}

export { checkIncludeRuby, checkIncludeAnyTag, replaceReadableTextAnyTag, checkIgnoreRubiesTest }