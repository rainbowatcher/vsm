<script lang="ts">
// useSnippets()
</script>

<template>
  <ul ma px1>
    <el-collapse accordion>
      <el-collapse-item title="Consistency" style="--el-collapse-header-height: 2rem" name="1">
        <!-- <li v-for="(p, idx) in snippets" :key="idx">
          <VListItem :index="idx" :label="p.name" :prefix="p.prefix" @select="updateCode" />
        </li> -->
      </el-collapse-item>
    </el-collapse>
  </ul>
</template>

<style>
.el-collapse-item:hover .el-collapse-item__header {
  background-color: #000000;
}
</style>