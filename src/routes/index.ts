import type { RouteRecordRaw } from "vue-router"
import { createRouter, createWebHistory } from "vue-router"
import Test from "@components/views/Test.vue"
import type { App } from "vue"
import DashBoard from "../components/views/DashBoard.vue"

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: "/",
    component: DashBoard,
  },
  { path: "/test", component: Test },
]

function setupRouter(app: App) {
  app.use(createRouter({ history: createWebHistory(), routes }))
}

export default setupRouter
