<script lang="ts" setup>
import type { VNode } from "vue"

defineProps<{
  icon?: string
}>()
const attrs = useAttrs()
console.log(attrs)
</script>

<template>
  <div class="inline-block leading-18px">
    <slot name="icon">
      <div :class="icon" leading-18px />
    </slot>
    <slot name="default" />
  </div>
</template>

<style scoped>

</style>