<template lang="pug">
div(class="header")
  div(class="container mx-auto p-4 max-w-screen-lg flex flex-col")
    div(class="text-white mx-auto text-2xl font-semibold") novels-reader -&nbsp;{{sharedStore.options.version}}
    div(class="text-white mx-auto") 対応サービス: ncode.syosetu.com, novel18.syosetu.com, kakuyomu.jp
    div(class="text-white mx-auto") その他: ローカルにあるhtmlファイル, URLに「pages-for-novels-reader」を含むページ
div(class="container mx-auto p-4 max-w-screen-lg")
  div(class="grid md:grid-cols-2 gap-5")
    div.options(class="")
      div(class="text-lg font-semibold") 音声設定
      p(class="text-sm mb-3") ※音声設定はOS・ブラウザ毎に挙動が違います…音声が正しく再生されない場合はより初期値に近い値を設定してみて下さい。
      div(class="grid md:grid-cols-3 gap-4 mb-3")
        div(class="")
          .font-semibold
            | 速度
            i(class="ml-1 fa-solid fa-circle-question cursor-pointer" data-tooltip-target="tooltip-rate" data-tooltip-placement="top")
            #tooltip-rate(role="tooltip" class="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700")
              | 読み上げ速度を設定出来ます。
              br
              | 初期値: 1.0, 最小値: 0.1, 最大値: 10.0
              div(class="tooltip-arrow" data-popper-arrow)
          input(
            v-model="sharedStore.options.voice.rate"
            name="rate" type="number" step="0.01" min="0.1" max="10" placeholder="1"
            class="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          )
        div(class="")
          .font-semibold
            | ピッチ
            i(class="ml-1 fa-solid fa-circle-question cursor-pointer" data-tooltip-target="tooltip-pitch" data-tooltip-placement="top")
            #tooltip-pitch(role="tooltip" class="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700")
              | 声の高さを設定出来ます。
              br
              | 初期値: 1.0, 最小値: 0, 最大値: 2.0
              div(class="tooltip-arrow" data-popper-arrow)
          input(
            v-model="sharedStore.options.voice.pitch"
            name="pitch" type="number" step="0.01" min="0" max="2" placeholder="1"
            class="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          )
        div(class="")
          .font-semibold
            | 音量
            i(class="ml-1 fa-solid fa-circle-question cursor-pointer" data-tooltip-target="tooltip-volume" data-tooltip-placement="top")
            #tooltip-volume(role="tooltip" class="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700")
              | 声の音量を設定出来ます。
              br
              | 初期値: 1.0, 最小値: 0, 最大値: 1.0
              div(class="tooltip-arrow" data-popper-arrow)
          input(
            v-model="sharedStore.options.voice.volume"
            name="volume" type="number" step="0.01" min="0" max="1" placeholder="1"
            class="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          )
      div(class="grid gap-4")
        div(class="")
          .font-semibold
            | ボイス設定
            i(class="ml-1 fa-solid fa-circle-question cursor-pointer" data-tooltip-target="tooltip-voice" data-tooltip-placement="top")
            #tooltip-voice(role="tooltip" class="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700")
              | 読み上げに使うボイスを設定出来ます。
              br
              | ※選択肢の「/」以降は対応言語です。
              div(class="tooltip-arrow" data-popper-arrow)
          select(
            v-model="sharedStore.options.voice.typeIndex"
            name="voiceType"
            class="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          )
            option(value="-1") 初期設定を使用する
            option(v-for='voice, i in sharedStore.availableVoices' :value='i') {{ voice.name }}: {{ voice.lang }}

      div(class="mt-5 mb-2 text-lg font-semibold") 自動再生設定
      div(class="flex items-center mb-1")
        input(v-model="sharedStore.options.autoPlay" id="autoPlay" name="autoPlay" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500")
        label(for="autoPlay" class="ml-2 text-gray-900 font-semibold") 自動で再生を始める
      div(class="flex items-center")
        input(v-model="sharedStore.options.autoMoveNext" id="autoMoveNext" name="autoMoveNext" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500")
        label(for="autoMoveNext" class="ml-2 text-gray-900 font-semibold") 次話がある場合、自動で移動する

    div(class="")
      div(class="text-lg font-semibold") 読み上げ文章設定
      p(class="text-sm mb-3") 小説ページの読み上げ箇所の設定です。
      div(class="flex items-center mb-1")
        input(v-model="sharedStore.options.readSections.title" id="title" name="title" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500")
        label(for="title" class="ml-2 text-gray-900 font-semibold") 題名
      div(class="flex items-center mb-1")
        input(v-model="sharedStore.options.readSections.foreword" id="foreword" name="foreword" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500")
        label(for="foreword" class="ml-2 text-gray-900 font-semibold") 前書き
      div(class="flex items-center mb-1")
        input(v-model="sharedStore.options.readSections.body" id="body" name="body" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500")
        label(for="body" class="ml-2 text-gray-900 font-semibold") 本文
      div(class="flex items-center mb-1")
        input(v-model="sharedStore.options.readSections.afterword" id="afterword" name="afterword" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500")
        label(for="afterword" class="ml-2 text-gray-900 font-semibold") 後書き

      div(class="mt-5 text-lg font-semibold") ハイライト設定
      p(class="text-sm mb-3") 再生中の段落ハイライトカラー等の設定です。
      div(class="grid md:grid-cols-2 gap-4 mb-3")
        div(class="")
          .font-semibold
            | テキストカラー
            i(class="ml-1 fa-solid fa-circle-question cursor-pointer" data-tooltip-target="tooltip-text-color" data-tooltip-placement="top")
            #tooltip-text-color(role="tooltip" class="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700")
              | 初期値: #fff
              div(class="tooltip-arrow" data-popper-arrow)
          input(
            v-model="sharedStore.options.highlight.textColor" name="textColor" type="text" placeholder="#fff"
            class="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          )
        div(class="")
          .font-semibold
            | 背景カラー
            i(class="ml-1 fa-solid fa-circle-question cursor-pointer" data-tooltip-target="tooltip-background-color" data-tooltip-placement="top")
            #tooltip-background-color(role="tooltip" class="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700")
              | 初期値: #498fd9
              div(class="tooltip-arrow" data-popper-arrow)
          input(
            v-model="sharedStore.options.highlight.backgroundColor" name="backgroundColor" type="text" placeholder="#498fd9"
            class="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          )
      div(class="grid gap-4")
        div(class="flex items-center")
          input(v-model="sharedStore.options.autoScroll" id="autoScroll" name="autoScroll" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500")
          label(for="autoScroll" class="ml-2 text-gray-900 font-semibold") 再生箇所に自動でスクロールする

  div(class="mt-16")
    div(class="text-lg font-semibold") ルビ辞書設定について
    p(class="text-sm") 対象文字を設定されたルビで読み替える辞書を設定出来ます。「ルビ対象文字::ルビ」のフォーマットで設定して下さい。複数設定する場合は下記の様に改行で区切って下さい。
    p(class="text-sm font-bold mb-8") ※ルビの優先度は「無視するルビ ＞ 小説ページのルビ ＞ ユーザー辞書 ＞ 小説別辞書」となっています。

    div(class="font-semibold mb-2") ユーザー辞書
    pre(class="bg-gray-200 rounded-lg text-sm p-3 w-full overflow-x-auto")
      | // ユーザー辞書サンプル --------
      | // 先頭に「//」を付ける事で、その行全てをコメントにする事が出来ます。
      |
      | // ルビ対象文字::ルビ
      | 本気::マジ
      | 強敵::友
      |
      | // ルビ対象文字には正規表現を使う事が出来ます。
      |
      | // 下記の例は「*」のみの文を空白で読み替えます。
      | ^\*+$::
      |
      | // 下記の例は「小突」の後に付く読みがなを保存して、それぞれ「こづき」「こづい」「こづく」で読み替えます。
      | 小突([きいく])::こづ$1
      |
      | // 下記の例は「球」前の数字を保存して、「1きゅう」「10きゅう」「100きゅう」等で読み替えます。
      | (\d+)球::$1きゅう

    p(class="mt-2 text-sm") ※正規表現についてより詳しく知りたい方は下記リンクをご参照下さい。
    div(class="flex mb-2")
      //- i(class="mr-2 fa-solid fa-link text-sm")
      a(
        class="hover:underline text-sm text-blue-600 visited:text-purple-600"
        href="https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_Expressions"
        target="_blank" rel="noopener noreferrer"
      ) 正規表現 - JavaScript | MDN

    textarea(:value="sharedStore.user.dictionary" @input="sharedStore.user.dictionary = $event.target.value; sharedStore.saveUserDictionary()" placeholder="ここにユーザー辞書を記述して下さい。" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-64 p-2.5 mb-3")

    .font-semibold 無視するルビ ※正規表現のみを記述して下さい。
    p(class="text-sm")
      | 強調表現等で使わるルビを無視する為の設定を正規表現で記述出来ます。例：「^・+$」を設定すると「・」のみのルビを無視します。複数設定する場合は「^・+$|^、+$|^。+$」の様にします。
    input(
      :value="sharedStore.user.ignoreRubies"
      @input="sharedStore.user.ignoreRubies = $event.target.value; sharedStore.saveUserIgnoreRubies()"
      name="textColor" type="text" placeholder="ここに無視するルビを記述して下さい。"
      class="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
    )

  div(class="text-lg font-semibold mt-8 mb-2") 小説別辞書
  p(class="text-sm mb-2")
    | 下記のボタンをクリックする事で、小説別辞書を編集する事が出来ます。小説別辞書は、この拡張機能を有効にした状態で、各小説ページを開くと自動で作成されます。小説ページのルビを自動で辞書に登録する設定も出来ます。
  div(class="flex items-center")
    input(v-model="sharedStore.options.autoSaveDictionary" id="autoSaveDictionary" name="autoSaveDictionary" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500")
    label(for="autoSaveDictionary" class="ml-2 text-gray-900 font-semibold") 小説のルビを自動で辞書に登録する
  div(v-if="sharedStore.dictionaries.length" class="grid md:grid-cols-4 gap-3 mt-3")
    div(
      v-for="dic, i in sharedStore.dictionaries"
      :key="dic.id"
      :class="`${dic.domain} and-hover flex flex-col justify-center cursor-pointer items-center text-white focus:ring-4 font-medium rounded-lg text-sm p-3.5`"
      @click="sharedStore.selectedNovelIndex = i"
    )
      p {{dic.name}}
  div(v-else class="mt-3")
    | 小説別辞書のデータはありません。対応サービスの小説ページを開いて下さい。

  #novelModal(
    v-if="sharedStore.SN"
    class="flex justify-center items-center overflow-y-auto overflow-x-hidden fixed inset-0"
    tabindex="-1"
    aria-hidden="true"
  )
    div(class="bg-slate-900/50 overflow-x-hidden fixed inset-0 z-10" @click="sharedStore.selectedNovelIndex = null")
    div(class="relative p-4 w-full max-w-2xl md:h-auto z-20")
      div(class="flex flex-col bg-white rounded-lg shadow")
        div(:class="`${sharedStore.SN.domain} rounded-t-lg p-4 flex justify-between`")
          div(:class="flex")
            p(class="text-white font-semibold") {{sharedStore.SN.name}}
            i(class="mr-2 fa-solid fa-link text-sm")
            a(
              class="text-white hover:text-white hover:underline break-all"
              :href="sharedStore.SNLink"
              target="_blank" rel="noopener noreferrer"
            )
              | {{sharedStore.SNLink}}
          i(class="ml-2 fa-solid fa-circle-xmark text-xl cursor-pointer" @click="sharedStore.selectedNovelIndex = null")
        div(class="p-4")
          textarea(:value="sharedStore.SN.raw" @input="sharedStore.SN.raw = $event.target.value; sharedStore.forceSaveDictionary()" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-96 p-2.5")

  div(class="text-lg font-semibold mt-16 mb-2") 各種データのエクスポート（書き出し）とインポート（読み込み）
  div(class="rounded-lg shadow-lg")
    div(class="rounded-t-lg p-4 bg-sky-500 text-white font-semibold") エクスポート
    div(class="p-4")
      | エクスポートするデータにチェックを入れて、「データをクリップボードにコピー」ボタンを押して下さい。
      br
      | データ(JSON形式)がクリップボードにコピーされるので、それをどこかに保存し、インポートしたい側のオプションページでインポートを実行して下さい。

      div(class="mt-3 mb-1 flex items-center")
        input(id="options" name="options" type="checkbox" v-model="exportOptions.options" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500")
        label(for="options" class="ml-2 text-gray-900 font-semibold") オプション設定（音声設定・ハイライト設定・読み上げ文章設定・自動再生設定）
      div(class="mb-1 flex items-center")
        input(id="user" name="user" type="checkbox" v-model="exportOptions.user" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500")
        label(for="user" class="ml-2 text-gray-900 font-semibold") ユーザーデータ（ユーザー辞書・無視するルビ）
      div(class="flex items-center")
        input(id="dictionaries" name="dictionaries" type="checkbox" v-model="exportOptions.dictionaries" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500")
        label(for="dictionaries" class="ml-2 text-gray-900 font-semibold") 小説別辞書
      button(@click="onClickExportButton" type="button" class="text-white bg-sky-500 hover:bg-sky-600 focus:ring-4 focus:ring-sky-200 font-semibold rounded-lg text-sm px-5 py-2.5 mt-3") データをクリップボードにコピー
  div(class="rounded-lg shadow-lg mt-4")
    div(class="rounded-t-lg p-4 bg-orange-400 text-white font-semibold") インポート
    div(class="p-4")
      | 下記のテキストエリアにエクスポートしたデータを貼り付けて、「データをインポートする」ボタンを押して下さい。
      br
      | インポート後にオプションページが自動更新されます。
      div(class="text-rose-500 font-semibold")
        | ※既存のデータ（既存のオプションや小説別辞書等）がある場合は上書きされるので、ご注意下さい。
        br
        | ※ボイス設定に関してですが「エクスポートしたOSと違うOSにインポートする場合」はボイス名/対応言語が変わる可能性があるので、インポート後は必ず確認するようにして下さい。

      div(class="mt-3 mb-1 flex items-center")
        input(id="newRubiesOnly" name="newRubiesOnly" type="checkbox" v-model="importOptions.newRubiesOnly" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500")
        label(for="newRubiesOnly" class="ml-2 text-gray-900 font-semibold") ユーザー辞書・小説別辞書はデータを残し、既存の辞書に無いルビのみをインポートする
      div(class="mb-1 flex items-center")
        input(id="oldVersion" name="oldVersion" type="checkbox" v-model="importOptions.oldVersion" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500")
        label(for="oldVersion" class="ml-2 text-gray-900 font-semibold") バージョン1.x系のデータをインポートする
      textarea(v-model="importOptions.importDataJson" placeholder="ここにエクスポートしたデータを貼り付けて下さい。" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-64 p-2.5 mt-3")
      div(v-if="importOptions.jsonError" class="mt-4 bg-red-100 rounded-lg p-3")
        | ⚠ インポートに失敗しました。エクスポートしたデータをそのまま貼り付けるか、エクスポートしたデータを編集している場合は正しいJSON形式に修正して下さい。🙈
      button(@click="onClickImportButton" type="button" class="text-white bg-orange-400 hover:bg-orange-500 focus:ring-4 focus:ring-orange-200 font-semibold rounded-lg text-sm px-5 py-2.5 mt-4") データをインポートする
</template>

<script setup>
import { onMounted, reactive } from 'vue'
// import { Button } from 'flowbite-vue'
import useSharedStore from '../stores/shared'

const sharedStore = useSharedStore()
const onSubscribe = (mutation, state) => {
  // IDEA: オプションと辞書をこのタイミングで毎回保存でも良いかな？ Storeをopt,dicで分けた方が良い？
  sharedStore.saveOptions()
}
let unsubscribeStore = sharedStore.$subscribe(onSubscribe)

const exportOptions = reactive({
  options: false,
  user: false,
  dictionaries: false
})
async function onClickExportButton() {
  const exportData = {}
  if(exportOptions.options) {
    exportData.options = sharedStore.options
  }
  if(exportOptions.user) {
    exportData.user = sharedStore.user
  }
  if(exportOptions.dictionaries) {
    exportData.dictionaries = sharedStore.dictionaries
  }
  await navigator.clipboard.writeText(JSON.stringify(exportData))
}

const importOptions = reactive({
  newRubiesOnly: false,
  oldVersion: false,
  importDataJson: null,
  jsonError: false
})
async function onClickImportButton() {
  try {
    importOptions.jsonError = false

    await unsubscribeStore()
    const importData = JSON.parse(importOptions.importDataJson)
    await sharedStore.importData(importData, importOptions.newRubiesOnly, importOptions.oldVersion)
    unsubscribeStore = await sharedStore.$subscribe(onSubscribe)
  } catch (error) {
    console.log(error)
    importOptions.jsonError = true
  }
}

onMounted(async () => {
  // ここでflowbiteを読み込む様にすると最初のModalは出る様になるけど、その後上手く表示出来ない…まぁ全部Vueで管理した方が良いかって感じ。
  // flowbite-vueに期待。既にModalはあるけどソース見てもまだちゃんと使えないみたい… https://github.com/themesberg/flowbite-vue/tree/main/src/components
  await import('flowbite')
  document.querySelectorAll('[data-tooltip-target]').forEach(triggerEl => {
    const targetEl = document.getElementById(triggerEl.getAttribute('data-tooltip-target'))
    const triggerType = triggerEl.getAttribute('data-tooltip-trigger');
    const placement = triggerEl.getAttribute('data-tooltip-placement');

    new Tooltip(targetEl, triggerEl)
  })
})

window.addEventListener('focus', async () => {
  await sharedStore.init()
})
</script>