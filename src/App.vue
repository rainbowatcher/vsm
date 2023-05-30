<template>
  <ElConfigProvider>
    <BaseLayout>
      <template #header>
        <Header />
      </template>
      <template #menu>
        <SideMenu />
      </template>
      <RouterView />
    </BaseLayout>
  </ElConfigProvider>
</template>

