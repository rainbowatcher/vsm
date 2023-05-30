<script lang="ts" setup>
import { storeToRefs } from "pinia"

const { current } = storeToRefs(useSnippetStore())
</script>

<template>
  <ElForm v-model="current" label-width="100" label-position="right">
    <ElRow :gutter="20">
      <ElCol :span="12">
        <ElFormItem label="Name" path="name">
          <ElInput v-model="current.name" type="text" size="small" placeholder="name" />
        </ElFormItem>
      </ElCol>
      <ElCol :span="12">
        <ElFormItem label="Language" path="lang">
          <ElInput v-model="current.lang" type="text" size="small" placeholder="lang" />
        </ElFormItem>
      </ElCol>
    </ElRow>
    <ElRow :gutter="20">
      <ElCol :span="12">
        <ElFormItem label="Keyword" path="keyword">
          <ElInput v-model="current.keyword" type="text" size="small" placeholder="keyword" />
        </ElFormItem>
      </ElCol>
      <ElCol :span="12">
        <ElFormItem label="createDate" path="createDate">
          <ElInput v-model="current.createDate" type="text" size="small" placeholder="createDate" />
        </ElFormItem>
      </ElCol>
    </ElRow>
    <ElFormItem label="Scope" path="tags">
      <ElInput v-model="current.tags" type="text" size="small" placeholder="tags" />
    </ElFormItem>
    <ElFormItem label="Description" path="desc">
      <ElInput v-model="current.desc" type="text" size="small" placeholder="desc" />
    </ElFormItem>
  </ElForm>
</template>

<style scoped></style>