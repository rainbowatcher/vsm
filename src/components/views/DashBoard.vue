<script setup lang="ts">
import Split from "split.js"
import type { VsmSnippet } from "@composables/vscode"
import { storeToRefs } from "pinia"
import VToolbar from "@components/VToolbar.vue"
import type { FormInstance, FormRules } from "element-plus"
import { ElInput } from "element-plus"

const editorContainer = ref<HTMLDivElement>()
const formData = reactive<VsmSnippet>({
  name: "",
  lang: "",
})
const snippetStore = useSnippetStore()
const { current, selectedName } = storeToRefs(snippetStore)
const [show, toggleShow] = useToggle(false)
const formRef = ref<FormInstance>()
const { getValue, setLang, setValue, resize, onValueChange } = useMonacoEditor({ container: editorContainer })

onMounted(async () => {
  Split(["#split-0", "#split-1"], {
    sizes: [30, 71],
    minSize: 0,
    gutterSize: 8,
    snapOffset: 100,
    onDrag: () => resize(),
  })
  onValueChange.value = (e) => {
    if (current.value !== null) {
      const value = getValue()
      current.value = { ...current.value, body: value }
    }
  }
  setTimeout(() => {
    resize()
  })
})

function select(lang: string, name:string) {
  selectedName.value = name
  const snippet = snippetStore.groupedSnippets[lang].find(i => i.name === name)
  if (snippet) current.value = snippet
  setValue(snippet?.body || "")
  setLang(snippet?.lang || "json")
}

const rules = reactive<FormRules>({
  name: [{ required: true, message: "name is required", trigger: "blur" }],
  lang: [{ required: true, message: "lang is required", trigger: "blur" }],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      snippetStore.add(formData)
      toggleShow(false)
    }
  })
}

async function test() {
  //
}
</script>

<template>
  <div class="split" w-full>
    <div id="split-0" h="[calc(100vh-2rem)]" mr--2 select-none bg="bg-neutral200">
      <VSearchbar />
      <VList :items="snippetStore.groupedSnippets" @select="select" />
    </div>

    <div id="split-1" h="[calc(100vh-2rem)]">
      <VToolbar @show-add="toggleShow" />
      <div ref="editorContainer" h="3/5" />
      <div grid="~ cols-2 auto-rows-min gap4" mt4 h-full px2 text-sm>
        <VMeta />

        <VDialog v-model:show="show">
          <VCard title="Title">
            <template #extra>
              <div class="i-carbon-close" text-lg icon-btn @click="toggleShow()" />
            </template>

            <template #footer>
              <ElButton plain @click="toggleShow()">
                Cancel
              </ElButton>
              <ElButton type="primary" @click="submitForm(formRef)">
                Confirm
              </ElButton>
            </template>

            <ElForm ref="formRef" :model="formData" :rules="rules" label-width="3rem">
              <ElFormItem label="name" prop="name">
                <ElInput v-model="formData.name" />
              </ElFormItem>
              <ElFormItem label="lang" prop="lang">
                <ElInput v-model="formData.lang" />
              </ElFormItem>
            </ElForm>
          </VCard>
        </VDialog>
      </div>
    </div>
  </div>
</template>

<style scoped>
.split {
  display: flex;
  flex-direction: row;
}

:deep(.gutter) {
  border-right: 1px solid #00000018;
}

:deep(.gutter):hover {
  background-color: #464e5758;
  opacity: 1;
}

:deep(.gutter):active {
  background-color: #45505b68;
  opacity: 1;
}

:deep(.gutter.gutter-horizontal) {
  cursor: col-resize;
}
</style>
