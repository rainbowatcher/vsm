<script lang="ts" setup>

</script>

<template>
  <div data-tauri-drag-region class="vsm-side-menu-wrapper" flex="~ col" fixed inset-0 h-screen w-16 justify-between bg-neutral2 dark:bg-neutral-600>
    <slot name="menu" />
  </div>

  <div data-tauri-drag-region class="vsm-header-wrapper" bg="dark:neutral7 neutral-50" top-0 h-8 px2 py1 pl-16>
    <slot name="header" />
  </div>
  <div class="vsm-content-wrapper" pl16 bg="dark:neutral-700 neutral-50">
    <slot name="content" />
  </div>
</template>