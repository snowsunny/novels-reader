<template lang="pug">
div(class="container mx-auto my-4")
  //- p {{sharedStore.dictionaries}}
  div(class="grid grid-cols-4 gap-4")
    div(
      v-for="dic, i in sharedStore.dictionaries"
      :class="`${dic.domain} and-hover flex flex-col justify-center cursor-pointer items-center text-white focus:ring-4 font-medium rounded-lg text-sm p-3.5`"
      @click="sharedStore.selectedNovelIndex = i"
    )
      p {{dic.name}}

  #novelModal(
    v-if='sharedStore.SN'
    class="flex justify-center items-center bg-slate-900/50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full"
    tabindex="-1"
    aria-hidden="true"
  )
    div(class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 w-full h-full" @click="sharedStore.selectedNovelIndex = null")
    div(class="relative p-4 w-full max-w-2xl h-full md:h-auto z-10")
      div(class="flex flex-col bg-white rounded-lg shadow")
        div(:class="`${sharedStore.SN.domain} rounded-t-lg p-4 flex justify-between`")
          div(:class="flex")
            p(class="text-white") {{sharedStore.SN.name}}
            i(class="mr-2 fa-solid fa-link text-sm" @click="sharedStore.selectedNovelIndex = null")
            a(
              class="text-white hover:text-white hover:underline"
              :href="sharedStore.SNLink"
              target="_blank" rel="noopener noreferrer"
            )
              | {{sharedStore.SNLink}}
          i(class="ml-2 fa-solid fa-circle-xmark text-xl cursor-pointer" @click="sharedStore.selectedNovelIndex = null")
        div(class="p-4")
          textarea(:value='sharedStore.SN.raw' @input="sharedStore.SN.raw = $event.target.value; sharedStore.forceSaveDictionary()" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-96 p-2.5 mb-3")
          p {{sharedStore.SN}}
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
      // await import('flowbite')
    })

    return {
      sharedStore, optionsStore
    }
  }
}
</script>