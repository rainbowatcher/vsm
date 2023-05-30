<script lang="ts" setup>
const {
  hasNativeHeader,
  sideMenuItems,
} = useSettings()
</script>

<template>
  <div class="vsm-side-menu" flex="~ col" :class="[hasNativeHeader ? 'mt-2' : 'mt-8']" gap-y-1.5>
    <ElTooltip v-for="item in sideMenuItems" :key="item.label" placement="right" effect="light" :show-after="1000" :content="item.label">
      <RouterLink :to="item.link">
        <div
          active="dark:bg-#606060 bg-#e3e3e3"
          hover="dark:bg-neutral-700 bg-neutral3"
          mx1 h-8 flex items-center justify-center rounded color-gray
        >
          <div :class="item.icon" text-4 />
        </div>
      </RouterLink>
    </ElTooltip>
  </div>
  <div flex="~ col" mb-1 gap-y-1>
    <ElTooltip placement="right" :delay="1000" content="Settings" effect="light">
      <RouterLink to="/settings">
        <div
          active="dark:bg-#606060 bg-#e3e3e3"
          hover="dark:bg-neutral-700 bg-neutral3"
          mx1 h-8 flex items-center justify-center rounded color-gray
        >
          <div class="i-mdi-settings" text-4 />
        </div>
      </RouterLink>
    </ElTooltip>
  </div>
</template>