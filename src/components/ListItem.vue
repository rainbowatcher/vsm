<script setup lang="ts">
const props = defineProps<{
  index: number
  label: string
  prefix: string
}>()
defineEmits<{
  (e: "select", idx: number): void
}>()
</script>

<template>
  <div hover:bg="dark:neutral-800 neutral" flex="~ row" w-full select-none justify-between rounded px2 @click="$emit('select', index)">
    <span>{{ label }}</span>
    <span truncate text="dark:coolGray " text-3>{{ prefix }}</span>
  </div>
</template>