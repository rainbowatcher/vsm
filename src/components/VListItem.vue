<script setup lang="ts">
import type { VsmSnippet } from "@composables/vscode"

const props = defineProps<{
  item: VsmSnippet
}>()

// const tags = props.item.tags.split
</script>

<template>
  <div
    bg="dark:#464648 neutral1" hover:bg="dark:#545458 #fcfcfc" active:hover:bg="dark:#404040 #fafafa"
    grid="~ cols-2 auto-rows-min" w-full cursor-pointer
    select-none px1 transition duration-200
  >
    <span text-4>{{ item.name }}</span>
    <span mla self-center>{{ item.prefix }}</span>
    <span text="dark:coolGray" truncate text-3>
      {{ item.tags }}
    </span>
    <span text="dark:coolGray" mla self-center text-3>{{ item.createDate }}</span>
  </div>
</template>