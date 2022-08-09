<template lang="pug">
div(class="container mx-auto my-4")
  div(class="grid grid-cols-4 gap-4")
    div(
      class="flex justify-center items-center text-white bg-teal-500 hover:bg-teal-700 focus:ring-4 font-medium rounded-lg text-sm p-3.5"
      v-for="dic in mainStore.dictionaries"
    )
      | {{dic}}
      | {{dic.name}}
</template>

<script>
import { ref, onMounted } from 'vue'
import useMainStore from '../stores/main'

export default {
  setup() {
    const isInitialized = ref(false)
    const mainStore = useMainStore()

    window.addEventListener('focus', async () => {
      console.log('foucs page')
      isInitialized.value = false
      await mainStore.init()
      isInitialized.value = true
    })
    onMounted(async () => {
      await mainStore.init()
      isInitialized.value = true
    })

    return {
      mainStore,
      isInitialized,
      test() {
        mainStore.count++
      }
    }
  }
}
</script>