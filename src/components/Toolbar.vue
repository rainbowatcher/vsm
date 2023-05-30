<script lang="ts" setup>
import { storeToRefs } from "pinia"

const store = useSnippetStore()
const [showAdd, toggleShowAdd] = useToggle(false)
// const [showImport, toggleShowImport] = useToggle(false)
const { current } = storeToRefs(store)

function test() {
  console.log(useSnippetStore().current)
}

function confirm() {
  store.trash()
  current.value = { name: "", lang: "" }
}
</script>

<template>
  <div class="vsm-toolbar" bg="dark:#1c1c1c white" h8 flex items-center justify-end pr1>
    <ButtonWithTooltip icon="i-mdi-plus" tooltip="Add" @click="toggleShowAdd()" />
    <ButtonWithTooltip icon="i-mdi-refresh" tooltip="Refresh" @click="store.refresh" />
    <ButtonWithTooltip icon="i-mdi-content-save" tooltip="Save" @click="store.update" />

    <ElPopconfirm
      width="220" confirm-button-text="Yes" cancel-button-text="No" title="Are you sure to delete?"
      @confirm="confirm"
    >
      <template #reference>
        <ElButton text size="small">
          <ElTooltip content="Delete" effect="light" :show-after="600" :enterable="false">
            <div class="i-mdi-delete-outline" height="320px" bg-red />
          </ElTooltip>
        </ElButton>
      </template>
    </ElPopconfirm>

    <ButtonWithTooltip icon="i-mdi-test-tube" tooltip="Test" @click="test" />

    <!-- TODO: Show all buttons when the parent component is wide enough  -->
    <ElDropdown trigger="click" text-2>
      <ElButton text size="small">
        <div class="i-mdi-more-horiz" />
      </ElButton>
      <template #dropdown>
        <ElDropdownMenu>
          <ElDropdownItem>
            <div class="i-mdi-fullscreen" mr-2 />
            Maximize
          </ElDropdownItem>
          <ElDropdownItem>
            <div class="i-mdi-bookmark-outline" mr-2 />
            Bookmark
          </ElDropdownItem>
          <ElDropdownItem @click="$router.push('/import')">
            <div class="i-mdi-import" mr-2 />
            Import
          </ElDropdownItem>
          <ElDropdownItem>
            <div class="i-mdi-export" mr-2 />
            Export
          </ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </div>

  <Add v-model="showAdd" />
</template>

<style scoped>
.el-button,
.el-button + .el-button {
  margin-left: 2px;
}
</style>