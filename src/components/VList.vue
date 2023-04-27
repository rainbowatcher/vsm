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
  <el-collapse>
    <el-collapse-item v-for="(snippets, key) in items" :key="key" :title="key" tabindex="-1">
      <VListItem v-for="(s, idx) in snippets" :key="idx" :item="s" @click="$emit('select', s.lang, s.name)" />
    </el-collapse-item>
  </el-collapse>
</template>
