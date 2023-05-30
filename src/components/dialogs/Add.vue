<script lang="ts" setup>
import { FormInstance, FormRules } from "element-plus"
import { VsmSnippet } from "../../types/snippet"

const props = defineProps<{modelValue: boolean}>()
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
}>()
const snippetStore = useSnippetStore()
const formRef = ref<FormInstance>()
const formData = reactive<VsmSnippet>({
  name: "",
  lang: "",
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: "name is required", trigger: "blur" }],
  lang: [{ required: true, message: "lang is required", trigger: "blur" }],
})

async function submitForm(formVal: FormInstance | undefined) {
  console.log(formVal)
  if (!formVal) {
    return
  }
  await formVal.validate((valid) => {
    if (valid) {
      snippetStore.add(formData)
      emit("update:modelValue", false)
    }
  })
}

watchEffect(() => { console.log(props.modelValue) })
</script>

<template>
  <ElDialog :model-value="modelValue" destroy-on-close>
    <ElForm ref="formRef" :model="formData" :rules="rules" label-width="3rem">
      <ElFormItem label="name" prop="name">
        <ElInput v-model="formData.name" />
      </ElFormItem>
      <ElFormItem label="lang" prop="lang">
        <ElInput v-model="formData.lang" />
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElButton plain @click="emit('update:modelValue', false)">
        Cancel
      </ElButton>
      <ElButton type="primary" @click="submitForm(formRef)">
        Confirm
      </ElButton>
    </template>
  </ElDialog>
</template>

<style scoped>

</style>