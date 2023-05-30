<script setup lang="ts">
import type { Component } from "vue"
import { createVNode } from "vue"
import { dialogInjectKey } from "./useGlobalDialog"
import type { DialogOptions } from "./useGlobalDialog"

const dialogHolder = ref<HTMLElement>()
const [show, toggleShow] = useToggle(false)
const dialogContent = ref<Component>()
const title = ref<string>()

provide(dialogInjectKey, (options: DialogOptions) => {
  const { comp, title: _title } = options
  if (!comp) throw new Error("component must be pass")
  if (comp.emits) {
    dialogContent.value = createVNode(comp, { onClose: () => toggleShow(false) })
  } else {
    dialogContent.value = createVNode(comp)
  }
  title.value = _title

  toggleShow()
})

watchTriggerable(show, () => {
  if (!show.value) {
    console.log("drop")
    dialogContent.value = undefined
  }
})
</script>

<template>
  <slot />
  <Teleport to="body">
    <ElDialog ref="dialogHolder" v-model="show" destroy-on-close>
      <template #header>
        {{ title }}
      </template>
      <template #default>
        <Component :is="dialogContent" />
      </template>
    </ElDialog>
  </Teleport>
</template>