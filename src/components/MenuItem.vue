<script lang="ts" setup>
defineProps<{
  icon: string
  label: string
}>()
defineEmits(["route"])
</script>

<template>
  <NTooltip placement="right" :delay="1000" trigger="hover">
    <template #trigger>
      <div
        active="dark:bg-#606060 bg-#e3e3e3"
        hover="dark:bg-neutral-700 bg-neutral3"
        mx1 h-8 flex items-center justify-center rounded color-gray @click="$emit('route')"
      >
        <div :class="icon" text-4 />
      </div>
    </template>
    {{ label }}
  </NTooltip>
</template>