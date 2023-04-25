<script lang="ts" setup>

</script>

<template>
  <div>
    <ElInput>
      <template #prefix>
        <div i-carbon-search />
      </template>
    </ElInput>
  </div>
</template>

<style scoped>
:deep(.el-input__wrapper) {
  box-shadow: none;
  border-radius: 0;
  /* border-top: 1px solid #00000020; */
  border-right: 1px solid #00000020;
}
</style>