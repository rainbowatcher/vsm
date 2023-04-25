<script lang="ts" setup>
const toggleDark = useToggle(useDark())
</script>

<template>
  <div data-tauri-drag-region w-full justify-between flex="~ row">
    <!-- <div flex="~ row" bg="dark:neutral7 white" data-tauri-drag-region mx--2 my--1 h8 justify-between px2 py1 color-neutral7 dark:color-neutral4> -->
    <div cursor-default select-none />
    <div btn class="i-carbon-light dark:i-carbon-moon" @click="toggleDark()" />
    <!-- </div> -->
  </div>
</template>