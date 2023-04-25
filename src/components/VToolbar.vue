<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { ElMessageBox } from "element-plus"

defineEmits(["showAdd"])
const store = useSnippetStore()
const { current } = storeToRefs(store)

function test() {
  console.log(useSnippetStore().current)
}

function confirm() {
  ElMessageBox.confirm("Are you sure to delete this snippet?")
    .then(() => {
      store.del(current.value.name)
      current.value = { name: "", lang: "" }
    }).catch(() => {
      //
    })
}
</script>

<template>
  <div class="vsm-toolbar" bg="dark:#1c1c1c white" h8 flex items-center justify-end pr1>
    <ElButton text size="small" @click="$emit('showAdd')">
      <div class="i-carbon-add" />
    </ElButton>
    <ElButton text size="small" @click="store.refetch">
      <div class="i-carbon-renew" />
    </ElButton>
    <ElButton text size="small" @click="store.save">
      <div class="i-carbon-save" />
    </ElButton>
    <ElButton text size="small" @click="confirm">
      <div class="i-carbon-delete" bg-red />
    </ElButton>
    <ElButton text size="small">
      <div class="i-carbon-export" />
    </ElButton>
    <ElButton text size="small" @click="test">
      <div class="i-vscode-icons-file-type-testts" />
    </ElButton>
  </div>
</template>

<style scoped>
</style>