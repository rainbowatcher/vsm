<script lang="ts" setup>
const {
  hasNativeHeader,
} = useSettings()
</script>

<template>
  <div
    class="vsm-side-menu-wrapper" flex="~ col" data-tauri-drag-region
    fixed inset-1px h-screen w-16 justify-between bg-neutral2 dark:bg-neutral-600
  >
    <slot name="menu" />
  </div>

  <div
    v-if="!hasNativeHeader" class="vsm-header-wrapper" bg="dark:neutral7 neutral-50"
    data-tauri-drag-region top-0 h-8 b px2 py1 pl-16
  >
    <slot name="header" />
  </div>
  <div class="vsm-content-wrapper" bg="dark:neutral-700 neutral-50" pl16>
    <slot />
  </div>
</template>