<script setup lang="ts">
</script>

<template>
  <VLayout>
    <template #menu>
      <VSideMenu />
    </template>
    <template #header>
      <VHeader />
    </template>
    <template #content>
      <RouterView />
    </template>
  </VLayout>
</template>

