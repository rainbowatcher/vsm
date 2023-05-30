<script lang="ts" setup>
import { VsmSnippet } from "@store/snippetStore"
import Split from "split.js"

const { getSnippets } = useVscodeStore()
const { snippets, conflictSnippets } = storeToRefs(useVscodeStore())
const diffEditorContainer = ref<HTMLDivElement>()
const data = computed(() => {
  return ({
    conflicts: conflictSnippets.value?.map<VsmSnippet>(i => i[1][0]) || [],
    snippets: snippets.value || [],
  })
})

const {
  instance,
  resize,
  getLeftValue,
  getRightValue,
  setValue,
  setLang,
  setRightValue,
  dispose: disposeDiff,
} = useMonacoDiffEditor(diffEditorContainer)
// const { setValue: setEditorValue, dispose } = useMonacoEditor({ container: diffEditorContainer })

onMounted(async () => {
  Split(["#split__snippet-list", "#split__snippet-studio"], {
    sizes: [30, 70],
    minSize: [200, 480],
    gutterSize: 4,
    // snapOffset: 20,
    gutterAlign: "end",
    onDrag: () => resize(),
  })
})

async function selectType(type: string) {
  if (type === "vscode") {
    await getSnippets()
  }
}

function select(lang: string, name:string) {
  const conflict = conflictSnippets.value?.find(i => i[0] === name)

  if (conflict) {
    // dispose()
    setValue(conflict?.[1][0].body || "", conflict?.[1][1].body || "", lang)
  // } else {
  //   const snippet = snippets.value?.find(i => i.name === name)
  //   disposeDiff()
  //   setEditorValue(snippet?.body || "")
  }

}
</script>

<template>
  <div v-show="!snippets?.length" grid h-screen place-items-center>
    <ElSpace wrap class="gap-4 [&>div>div]:(h-20 w-20 flex items-center justify-center rounded bg-neutral-100/10 transition-300)">
      <div shadow-md hover:shadow-xl @click="selectType('vscode')">
        <div class="i-devicon-vscode h8 w8" />
      </div>
      <div shadow-md hover:shadow-xl @click="selectType('idea')">
        <div class="i-devicon-intellij h8 w8" />
      </div>
      <div shadow-md hover:shadow-xl @click="selectType('extension')">
        <div class="i-mdi-extension h8 w8" />
      </div>
    </ElSpace>
  </div>
  <div v-show="snippets?.length" class="split" h-screen w-full>
    <div id="split__snippet-list" bg="bg-neutral200" mr--1 select-none>
      <!-- <ElInput v-model="keyword" placeholder="Search" @keydown="search">
        <template #suffix>
          <div class="i-mdi-search" icon-btn @click="search" />
        </template>
      </ElInput> -->
      <ElScrollbar style="height: calc(100vh)">
        <List :items="data" @select="select" />
      </ElScrollbar>
    </div>

    <div id="split__snippet-studio" max-h-screen>
      <!-- <VToolbar /> -->
      <div ref="diffEditorContainer" h-screen />
    </div>
  </div>
</template>

<style scoped>
.el-vl__wrapper{
  height: 100%;
}
</style>