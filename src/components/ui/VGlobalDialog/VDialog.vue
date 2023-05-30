<script lang="ts" setup>
const props = defineProps<{ show: boolean }>()
const emit = defineEmits<{ (e: "update:show"): void }>()
const model = useVModel(props, "show", emit)
function close() { model.value = false }
</script>

<template>
  <div v-show="show" class="vsm-dialog-wrapper" role="dialog" fixed inset-0 z-99 h-screen w-screen>
    <div class="vsm-dialog-mask" fixed inset-0 bg="dark/42" @click="close" />
    <div class="vsm-dialog-content" relative top="30%" ma w-sm>
      <slot name="header" />
      <slot name="default" />
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>

</style>