<script lang="ts" setup>
import { storeToRefs } from "pinia"

const { current } = storeToRefs(useSnippetStore())
</script>

<template>
  <div>
    <span>Name:</span>
    <ElInput v-model="current.name" type="text" />
  </div>
  <div>
    <span>Language:</span>
    <ElInput v-model="current.lang" type="text" />
  </div>
  <div h-auto>
    <span>Scope:</span>
    <ElInput v-model="current.tags" type="text" />
  </div>
  <div>
    <span>Prefix:</span>
    <ElInput v-model="current.prefix" type="text" />
  </div>
  <div>
    <span>Description:</span>
    <ElInput v-model="current.desc" type="text" />
  </div>
  <div>
    <span>createDate:</span>
    <ElInput v-model="current.createDate" type="text" />
  </div>
</template>

<style scoped>

</style>