<script lang="ts" setup>
import type { GroupedSnippets } from "@composables/vscode"

const props = defineProps<{
  items: GroupedSnippets
}>()
defineEmits<{
  (e: "select", lang: string, name: string): void
}>()
</script>

<template>
  <el-collapse class="0s; --el-transition-duration:">
    <el-collapse-item v-for="(snippets, key) in items" :key="key" :title="key">
      <VListItem v-for="(s, idx) in snippets" :key="idx" :item="s" @click="$emit('select', s.lang, s.name)" />
    </el-collapse-item>
  </el-collapse>
</template>

<style scoped>
/* element plus collapse */
:deep(.el-collapse-item__content) {
  padding-bottom: 0 !important;
}

:deep(.el-collapse-item__header) {
  padding: 0px 4px;
  background-color: #484848;
}
</style>
