<script setup lang="ts">
import Split from "split.js"
import { storeToRefs } from "pinia"

const editorContainer = ref<HTMLDivElement>()
const snippetStore = useSnippetStore()
const { current } = storeToRefs(snippetStore)
const { getValue, setLang, setValue, resize, onValueChange } = useMonacoEditor({ container: editorContainer })

onMounted(async () => {
  Split(["#split__snippet-list", "#split__snippet-studio"], {
    sizes: [30, 71],
    minSize: [200, 480],
    gutterSize: 6,
    snapOffset: 20,
    onDrag: () => resize(),
  })
  Split(["#split__snippet-editor", "#split__snippet-meta"], {
    direction: "vertical",
    sizes: [30, 70],
    minSize: [300, 0],
    gutterSize: 6,
    snapOffset: 30,
    onDrag: () => resize(),
  })
  onValueChange.value = () => {
    if (current.value) {
      const value = getValue()
      current.value.body = value
    }
  }
  nextTick(() => {
    setTimeout(() => {
      resize()
    })
  })
})

function select(name: string, lang:string) {
  snippetStore.select(name, lang)
  setValue(current.value?.body || "")
  setLang(lang || "json")
}
</script>

<template>
  <div class="split" h-screen>
    <div id="split__snippet-list" bg="bg-neutral200" mr--1 select-none>
      <Searchbar mb2 />
      <ElScrollbar style="height: calc(100vh - 2rem)">
        <List :items="snippetStore.groupedSnippets" @select="select" />
      </ElScrollbar>
    </div>

    <div id="split__snippet-studio" max-h-screen>
      <div id="split__snippet-editor">
        <Toolbar />
        <div ref="editorContainer" h="[calc(100%-2rem)]" />
      </div>
      <div id="split__snippet-meta">
        <StudioExtra />
      </div>
    </div>
  </div>
</template>

