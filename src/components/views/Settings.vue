<script lang="ts" setup>
const { vsmTheme, changeTheme, themeOptions } = useSettings()
</script>

<template>
  <div mx2>
    <span> Theme: </span>
    <ElSelect class="m-2" placeholder="Select" :model-value="vsmTheme" @change="changeTheme">
      <el-option
        v-for="item in themeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </ElSelect>
  </div>
</template>

<style scoped>

</style>