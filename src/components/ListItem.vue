<script setup lang="ts">
import type { VsmSnippetView } from "../types/snippett"

const props = defineProps<{
  item: VsmSnippetView
}>()

const tags = computed(() => props.item.tags?.split(","))
</script>

<template>
  <div
    bg="dark:#353535 neutral1" hover:bg="dark:#505050 #fcfcfc" active:hover:bg="dark:#404040 #fafafa"
    w-full cursor-pointer select-none px2 py1 transition duration-200
  >
    <div flex justify-between>
      <span mr2 truncate font-mono text-3>{{ item.name }}</span>
      <span w-6rem truncate font-mono>{{ item.keyword }}</span>
    </div>
    <span flex="~ row gap-1" col-span-2 truncate>
      <ElTag
        v-for="tag in tags" :key="tag" type="info"
        effect="plain"
        size="small" round
      >{{ tag }}
      </ElTag>
    </span>
  </div>
</template>