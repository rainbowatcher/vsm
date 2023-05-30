<script lang="ts" setup>

</script>

<template>
  <ElInput size="small">
    <template #prefix>
      <div i-carbon-search />
    </template>
  </ElInput>
</template>

<style scoped>
:deep(.el-input__wrapper) {
  box-shadow: none;
  border-radius: 0;
  /* border-top: 1px solid #00000020; */
  /* border-right: 1px solid #00000020; */
}
:deep(.el-input__wrapper:hover) {
  box-shadow: none;
  outline: none;
}

:deep(.el-input__wrapper:focus-within) {
  box-shadow: none;
  outline: none;
}
</style>