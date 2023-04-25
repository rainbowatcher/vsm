<script lang="ts" setup>
</script>

<template>
  <div class="vsm-side-menu" mt-8 flex="~ col" gap-y-2>
    <div hover="dark:bg-neutral-600 bg-neutral3" mx1 h-10 rounded text-center leading-14 color-gray @click="$router.push('/')">
      <div i-carbon-home text-xl />
    </div>
    <div hover="dark:bg-neutral-600 bg-neutral3" mx1 h-10 rounded text-center leading-14 color-gray>
      <div i-carbon-dashboard text-xl />
    </div>
    <div hover="dark:bg-neutral-600 bg-neutral3" mx1 h-10 rounded text-center leading-14 color-gray>
      <div i-carbon-analytics text-xl />
    </div>
  </div>
  <div flex="~ col" mb-1 gap-y-2>
    <div hover="dark:bg-neutral-600 bg-neutral3" mx1 h-10 rounded text-center leading-14 color-gray @click="$router.push('/test')">
      <div class="i-carbon-menu" text-xl />
    </div>
    <div hover="dark:bg-neutral-600 bg-neutral3" mx1 h-10 rounded text-center leading-14 color-gray>
      <div i-carbon-settings text-xl />
    </div>
  </div>
</template>