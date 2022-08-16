<template lang="pug">
div(class="header")
  div(class="container mx-auto p-4 md:px-0")
    div(class="text-white text-2xl font-semibold") novels-reader -&nbsp;
    div(class="text-white") Web page reader for [ncode.syosetu.com, novel18.syosetu.com, kakuyomu.jp]
div(class="container mx-auto p-4 md:px-0")
  div(class="grid md:grid-cols-2 gap-5")
    div(class="")
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
            name="voiceType"
            class="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          )
            option(value="-1") 初期設定を使用する

      div(class="mt-5 mb-2 text-lg font-semibold") 自動再生設定
      div(class="flex items-center mb-1")
        input(id="autoPlay" name="autoPlay" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500")
        label(for="autoPlay" class="ml-2 text-gray-900") 自動で再生を始める
      div(class="flex items-center")
        input(id="autoMoveNext" name="autoMoveNext" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500")
        label(for="autoMoveNext" class="ml-2 text-gray-900") 次話がある場合、自動で移動する

    div(class="")
      div(class="text-lg font-semibold") 読み上げ文章設定
      p(class="text-sm mb-3") 小説ページの読み上げ箇所の設定です。
      div(class="flex items-center mb-1")
        input(id="title" name="title" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500")
        label(for="title" class="ml-2 text-gray-900") 題名
      div(class="flex items-center mb-1")
        input(id="foreword" name="foreword" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500")
        label(for="foreword" class="ml-2 text-gray-900") 前書き
      div(class="flex items-center mb-1")
        input(id="body" name="body" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500")
        label(for="body" class="ml-2 text-gray-900") 本文
      div(class="flex items-center mb-1")
        input(id="afterword" name="afterword" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500")
        label(for="afterword" class="ml-2 text-gray-900") 後書き

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
            name="textColor" type="text" placeholder="#fff"
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
            name="backgroundColor" type="text" placeholder="#498fd9"
            class="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          )
      div(class="grid gap-4")
        div(class="flex items-center")
          input(id="autoScroll" name="autoScroll" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500")
          label(for="autoScroll" class="ml-2 text-gray-900") 再生箇所に自動でスクロールする

  div(class="mt-5")
    div(class="text-lg font-semibold") ルビ辞書設定について
    p(class="text-sm") 対象文字を設定されたルビで読み替える辞書を設定出来ます。「ルビ対象文字::ルビ」のフォーマットで設定して下さい。複数設定する場合は下記の様に改行で区切って下さい。
    p(class="text-sm font-bold mb-3") ※ルビの優先度は「無視するルビ ＞ 小説ページのルビ ＞ ユーザー辞書 ＞ 小説別辞書」となっています。

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

    p(class="mt-2 text-sm") ※正規表現についてより詳しく知りたい方は下記リンクを参考にしてみて下さい。
    div(class="flex mb-2")
      i(class="mr-2 fa-solid fa-link text-sm")
      a(
        class="hover:underline text-sm"
        href="https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_Expressions"
        target="_blank" rel="noopener noreferrer"
      ) 正規表現 - JavaScript | MDN

    textarea(placeholder="ここにユーザー辞書を記述して下さい。" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-64 p-2.5 mb-3")

    .font-semibold 無視するルビ ※正規表現のみを記述して下さい。
    p(class="text-sm")
      | 強調表現等で使わるルビを無視する為の設定を正規表現で記述出来ます。例：「^・+$」を設定すると「・」のみのルビを無視します。
    input(
      name="textColor" type="text" placeholder="ここに無視するルビを記述して下さい。"
      class="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
    )

  div(class="text-lg font-semibold mt-5 mb-2") 小説別辞書
  p(class="text-sm mb-2")
    | 下記のボタンをクリックする事で、小説別辞書を編集する事が出来ます。小説別辞書は、この拡張機能を有効にした状態で、各小説ページを開くと自動で作成されます。小説ページのルビを自動で辞書に登録する設定も出来ます。
  div(class="flex items-center")
    input(id="autoSaveDictionary" name="autoSaveDictionary" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500")
    label(for="autoSaveDictionary" class="ml-2 text-gray-900") 小説のルビを自動で辞書に登録する
  div(class="grid md:grid-cols-4 gap-4 mt-3")
    div(
      v-for="dic, i in sharedStore.dictionaries"
      :class="`${dic.domain} and-hover flex flex-col justify-center cursor-pointer items-center text-white focus:ring-4 font-medium rounded-lg text-sm p-3.5`"
      @click="sharedStore.selectedNovelIndex = i"
    )
      p {{dic.name}}

  #novelModal(
    v-if="sharedStore.SN"
    class="flex justify-center items-center bg-slate-900/50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full"
    tabindex="-1"
    aria-hidden="true"
  )
    div(class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 w-full h-full" @click="sharedStore.selectedNovelIndex = null")
    div(class="relative p-4 w-full max-w-2xl h-full md:h-auto z-10")
      div(class="flex flex-col bg-white rounded-lg shadow")
        div(:class="`${sharedStore.SN.domain} rounded-t-lg p-4 flex justify-between`")
          div(:class="flex")
            p(class="text-white font-semibold") {{sharedStore.SN.name}}
            i(class="mr-2 fa-solid fa-link text-sm")
            a(
              class="text-white hover:text-white hover:underline"
              :href="sharedStore.SNLink"
              target="_blank" rel="noopener noreferrer"
            )
              | {{sharedStore.SNLink}}
          i(class="ml-2 fa-solid fa-circle-xmark text-xl cursor-pointer" @click="sharedStore.selectedNovelIndex = null")
        div(class="p-4")
          textarea(:value="sharedStore.SN.raw" @input="sharedStore.SN.raw = $event.target.value; sharedStore.forceSaveDictionary()" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-96 p-2.5 mb-3")
          p {{sharedStore.SN}}

  div(class="text-lg font-semibold mt-5 mb-2") 各種データのエクスポート（書き出し）とインポート（読み込み）
  div(class="rounded-lg shadow-lg")
    div(class="rounded-t-lg p-4 bg-sky-500 text-white font-semibold") エクスポート
    div(class="p-4")
      | エクスポートするデータにチェックを入れて、「データをクリップボードにコピー」ボタンを押して下さい。
      br
      | データ(JSON形式)がクリップボードにコピーされるので、それをどこかに保存し、インポートしたい側のオプションページでインポートを実行して下さい。

      div(class="mt-3 mb-1 flex items-center")
        input(id="options" name="options" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500")
        label(for="options" class="ml-2 text-gray-900") オプション設定（音声設定・ハイライト設定・読み上げ文章設定・自動再生設定）
      div(class="flex items-center")
        input(id="dictionaries" name="dictionaries" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500")
        label(for="dictionaries" class="ml-2 text-gray-900") 辞書設定（ユーザー辞書・無視するルビ・小説別辞書）
      button(type="button" class="text-white bg-sky-500 hover:bg-sky-600 focus:ring-4 focus:ring-sky-200 font-semibold rounded-lg text-sm px-5 py-2.5 mr-2 mt-3") データをクリップボードにコピー
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
        input(id="newRubiesOnly" name="newRubiesOnly" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500")
        label(for="newRubiesOnly" class="ml-2 text-gray-900") ユーザー辞書・小説別辞書はデータを残し、既存の辞書に無いルビのみをインポートする
      textarea(placeholder="ここにエクスポートしたデータを貼り付けて下さい。" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-64 p-2.5 mt-3")
      button(type="button" class="text-white bg-orange-400 hover:bg-orange-500 focus:ring-4 focus:ring-orange-200 font-semibold rounded-lg text-sm px-5 py-2.5 mr-2 mt-4") データをインポートする
</template>

<script>
import { onMounted } from 'vue'
// import { Button } from 'flowbite-vue'
import useSharedStore from '../stores/shared'
import useOptionsStore from '../stores/options'

export default {
  // components: {
  //   Button
  // },
  setup() {
    const sharedStore = useSharedStore()
    const optionsStore = useOptionsStore()

    window.addEventListener('focus', async () => {
      console.log('foucs page')
      await sharedStore.init()
    })
    onMounted(async () => {
      await sharedStore.init()

      // ここでflowbiteを読み込む様にすると最初のModalは出る様になるけど、その後上手く表示出来ない…まぁ全部Vueで管理した方が良いかって感じ。
      // flowbite-vueに期待。既にModalはあるけどソース見てもまだちゃんと使えないみたい… https://github.com/themesberg/flowbite-vue/tree/main/src/components
      await import('flowbite')

      // function initTooltip() {
      //   document.querySelectorAll('[data-tooltip-target]').forEach(triggerEl => {
      //     const targetEl = document.getElementById(triggerEl.getAttribute('data-tooltip-target'))
      //     const triggerType = triggerEl.getAttribute('data-tooltip-trigger');
      //     const placement = triggerEl.getAttribute('data-tooltip-placement');

      //     new Tooltip(targetEl, triggerEl, {
      //       placement: placement ? placement : Default.placement,
      //       triggerType: triggerType ? triggerType : Default.triggerType
      //     })
      //   })
      // }
    })

    return {
      sharedStore, optionsStore
    }
  }
}
</script>