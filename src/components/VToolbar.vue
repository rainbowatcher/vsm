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
  store.del(current.value.name)
  current.value = { name: "", lang: "" }
}
</script>

<template>
  <div class="vsm-toolbar" bg="dark:#1c1c1c white" h8 flex items-center justify-end pr1>
    <ElButton text size="small" @click="$emit('showAdd')">
      <ElTooltip content="Add" effect="light" :show-after="600" :enterable="false">
        <div class="i-mdi-plus" />
      </ElTooltip>
    </ElButton>
    <ElButton text size="small">
      <ElTooltip content="Like" effect="light" :show-after="600" :enterable="false">
        <div class="i-mdi-cards-heart-outline" />
      </ElTooltip>
    </ElButton>
    <ElButton text size="small" @click="store.refresh">
      <ElTooltip content="Refresh" effect="light" :show-after="600" :enterable="false">
        <div class="i-mdi-refresh" />
      </ElTooltip>
    </ElButton>
    <ElButton text size="small" @click="store.save">
      <ElTooltip content="Save" effect="light" :show-after="600" :enterable="false">
        <div class="i-mdi-content-save" />
      </ElTooltip>
    </ElButton>
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
    <ElButton text size="small">
      <ElTooltip content="Export" effect="light" :show-after="600" :enterable="false">
        <div class="i-mdi-export" />
      </ElTooltip>
    </ElButton>
    <ElButton text size="small">
      <ElTooltip content="Import" effect="light" :show-after="600" :enterable="false">
        <div class="i-mdi-import" />
      </ElTooltip>
    </ElButton>
    <ElButton text size="small">
      <ElTooltip content="Maximize" effect="light" :show-after="600" :enterable="false">
        <div class="i-mdi-fullscreen" />
      </ElTooltip>
    </ElButton>
    <ElButton text size="small" @click="test">
      <ElTooltip content="Test" effect="light" :show-after="600" :enterable="false">
        <div class="i-mdi-test-tube" />
      </ElTooltip>
    </ElButton>

    <!-- TODO: when  -->
    <el-dropdown trigger="click" hidden>
      <ElButton text size="small">
        <div class="i-mdi-more-horiz" />
      </ElButton>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>
            <ElButton text size="small">
              <template #icon>
                <div class="i-carbon-maximize" />
              </template>
              maximize
            </ElButton>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style scoped>
.el-button,
.el-button+.el-button {
  margin-left: 2px;
}
</style>