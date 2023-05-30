<script lang="ts" setup>
import type { GroupedSnippets } from "@store/vscodeStore"

defineProps<{
  items: GroupedSnippets
}>()
defineEmits<{
  (e: "select", name: string, lang: string): void
}>()
const activeNames = ref<number[]>([0])
</script>

<template>
  <ElCollapse v-model="activeNames">
    <ElCollapseItem v-for="(snippets, lang, idx) in items" :key="lang" :name="idx" :title="lang" tabindex="-1">
      <ListItem v-for="(s, itemIdx) in snippets" :key="itemIdx" :item="s" @click="$emit('select', s.name, s.lang)" />
    </ElCollapseItem>
  </ElCollapse>
</template>

