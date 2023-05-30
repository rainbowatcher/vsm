<script lang="ts" setup>
defineProps<{
  title?: string
}>()
defineEmits(["close"])
</script>

<template>
  <div class="vsm-dialog-card" rounded bg-white p4 shadow="xl dark:neutral8 neutral3" outline="1 solid neutral2 dark:neutral6" dark:bg-neutral7>
    <div class="vsm-card-header" flex="~ row" justify-between>
      <span v-if="title" text-4 font-500>
        {{ title }}
      </span>
      <slot name="extra" />
    </div>

    <div class="vsm-card-content" my-4>
      <slot />
    </div>

    <div class="vsm-card-footer" flex justify-end>
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>

</style>