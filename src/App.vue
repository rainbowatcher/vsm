<script setup lang="ts">
import Split from "split.js"
import { isRef, onMounted, ref } from "vue"
import { useDark, useToggle } from "@vueuse/core"
import ListItem from "./components/ListItem.vue"
import type { Profile, VSMSnippet } from "./composables/useSnippets"
import { getAllProfiles, getSnippetItems, getUniqueSnippets } from "./composables/useSnippets"
import { useMonacoEditor } from "./composables/editor"

const toggleDark = useToggle(useDark())
const editorContainer = ref<HTMLDivElement>()
const profiles = ref<Profile[]>()
const snippets = ref<VSMSnippet[]>()
const current = ref<VSMSnippet>()
const [show, toggleShow] = useToggle(false)
const { data, lang, instance, resize } = useMonacoEditor({ container: editorContainer })
onMounted(async () => {
  Split(["#split-0", "#split-1"], {
    sizes: [30, 70],
    minSize: 0,
    gutterSize: 6,
    snapOffset: 100,
    onDrag: () => resize(),
  })
  profiles.value = await getAllProfiles()
  const items = await getSnippetItems()
  snippets.value = getUniqueSnippets(items)
  resize()
})

function updateCode(index: number) {
  const { body, lang } = snippets.value?.at(index) || {}
  const newBody = body?.map(i => i.replace(/"/, "")).join("\n")
  current.value = snippets.value?.at(index)
  setEditorValue(newBody)
  setEditorLang(lang || "json")
}

function setEditorValue(val?: string) {
  instance.value?.setValue(val || "")
}

function setEditorLang(language: string) {
  if (isRef(lang))
    lang.value = language
}
function exportSnippets(val: Profile) {
  console.log(val)
}
</script>

<template>
  <div class="vsm-side-menu-wrapper" flex="~ col" fixed inset-0 h-screen w-16 justify-between bg-white dark:bg-neutral-700>
    <div class="vsm-side-menu" mt-8 flex="~ col" gap-y-2>
      <div hover="dark:bg-neutral-600 bg-neutral3" mx1 h-10 rounded text-center leading-14 color-gray>
        <div i-carbon-home text-xl />
      </div>
      <div hover="dark:bg-neutral-600 bg-neutral3" mx1 h-10 rounded text-center leading-14 color-gray>
        <div i-carbon-dashboard text-xl />
      </div>
      <div hover="dark:bg-neutral-600 bg-neutral3" mx1 h-10 rounded text-center leading-14 color-gray>
        <div i-carbon-analytics text-xl />
      </div>
    </div>
    <div mb-1>
      <div hover="dark:bg-neutral-600 bg-neutral3" mx1 h-10 rounded text-center leading-14 color-gray>
        <div i-carbon-settings text-xl />
      </div>
    </div>
  </div>
  <div class="split" pl-16>
    <div class="vsm-header-wrapper" w="[calc(100vw-4rem)]" bg="dark:neutral-800 gray-50" fixed left-16 top-0 h-16 px2 py1>
      <div flex="~ row" bg="dark:neutral7 white" data-tauri-drag-region mx--2 my--1 h8 justify-between px2 py1 color-neutral7 dark:color-neutral4>
        <div select-none>
          header
        </div>
        <div btn class="i-carbon-light dark:i-carbon-moon" @click="toggleDark()" />
      </div>
    </div>
    <div id="split-0" h="[calc(100vh-4rem)]" overflow="x-hidden y-scroll" mt-16>
      <ul ma p1>
        <li v-for="(p, idx) in snippets" :key="idx">
          <ListItem :index="idx" :label="p.name" :prefix="p.prefix" @select="updateCode" />
        </li>
      </ul>
    </div>
    <div id="split-1" mt-16 h="[calc(100vh-4rem)]">
      <!-- {{ current?.description }} {{ current?.scope }} -->
      <div ref="editorContainer" class="editor" h="3/5" />
      <div mt4 h-full text-sm grid="~ cols-2 auto-rows-min gap4">
        <div>
          <span block>language:</span>
          <input type="text" :value="current?.lang">
        </div>
        <div h-auto>
          <span block>scope:</span>
          <input type="text" :value="current?.scope">
        </div>
        <div>
          <span block>prefix:</span>
          <input type="text" :value="current?.prefix">
        </div>
        <div>
          <span block>description:</span>
          <input type="text" :value="current?.description">
        </div>
        <div>
          <div btn @click="toggleShow()">
            Export
          </div>
        </div>
        <div v-show="show" class="vsm-dialog-wrapper" fixed inset-0 z-99 h-screen w-screen>
          <div class="vsm-dialog-mask" fixed inset-0 bg="black/40" @click="toggleShow()" />
          <div class="vsm-dialog-card" top="30%" shadow="~ md" relative ma h-auto w-sm rounded bg-neutral7 p4>
            <div flex="~ row" justify-between>
              <span>title</span>
              <div btn class="i-carbon-close" @click="toggleShow()" />
            </div>
            <div my-4>
              <div v-for="p in profiles" :key="p.path">
                <div hover:bg="neutral/40" @click="exportSnippets(p)">
                  {{ p.profile }}
                </div>
              </div>
            </div>
            <div flex justify-end gap-4>
              <div btn @click="toggleShow()">
                Cancel
              </div>
              <div btn>
                Confirm
              </div>
            </div>
          </div>
        </div>
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
  background-repeat: no-repeat;
  background-position: 50%;
}

:deep(.gutter):hover {
  background-color: #464e5768;
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
