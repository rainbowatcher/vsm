import type { RouteRecordRaw } from "vue-router"
import { createRouter, createWebHistory } from "vue-router"
import type { App } from "vue"
import Test from "@/views/Test.vue"
import Settings from "@/views/Settings.vue"
import Dashboard from "@/views/Dashboard.vue"
import Import from "@/views/Import.vue"

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
