import type { RouteRecordRaw } from "vue-router"
import { createRouter, createWebHistory } from "vue-router"
import type { App } from "vue"
import Test from "@components/views/Test.vue"
import Settings from "@components/views/Settings.vue"
import Dashboard from "@components/views/Dashboard.vue"
import Import from "@components/views/Import.vue"

const routes: Readonly<RouteRecordRaw[]> = [
  { path: "/", component: Dashboard },
  { path: "/test", component: Test },
  { path: "/import", component: Import },
  { path: "/settings", component: Settings },
]

function setupRouter(app: App) {
  const router = createRouter({ history: createWebHistory(), routes })
  app.use(router)
}

export default setupRouter
