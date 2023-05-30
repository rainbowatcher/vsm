<script lang="ts" setup>
defineProps<{
  icon: string
  tooltip: string
}>()
</script>

<template>
  <div>
    <ElTooltip :content="tooltip" effect="light" :show-after="600" :enterable="false">
      <ElButton text size="small">
        <div :class="icon" />
      </ElButton>
    </ElTooltip>
  </div>
</template>
