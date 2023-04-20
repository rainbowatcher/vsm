<script>

</script>

<template>
  <div class="vsm-side-menu-wrapper" flex="~ col" fixed inset-0 h-screen w-16 justify-between bg-white dark:bg-neutral-700>
    <slot name="menu" />
  </div>
  <div>
    <div class="vsm-header-wrapper" w="[calc(100vw-4rem)]" bg="dark:neutral-800 gray-50" fixed left-16 top-0 h-16 px2 py1>
      <slot name="header" />
    </div>
    <slot name="content" />
  </div>
</template>