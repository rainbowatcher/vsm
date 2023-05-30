<script lang="ts" setup>
const toggleDark = useToggle(useDark())
</script>

<template>
  <div data-tauri-drag-region w-full justify-between flex="~ row">
    <div cursor-default select-none />
    <div btn class="i-carbon-light dark:i-carbon-moon" @click="toggleDark()" />
  </div>
</template>