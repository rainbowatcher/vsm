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
  <div select-none px2 hover:bg="dark:neutral-800 neutral" rounded w-full flex="~ row" justify-between @click="$emit('select', index)">
    <span>{{ label }}</span>
    <span truncate text="dark:coolGray " text-3>{{ prefix }}</span>
  </div>
</template>