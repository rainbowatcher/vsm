import { createApp } from "vue"
import setupRouter from "./routes"
import App from "./App.vue"

import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"
import "./styles.css"
import "@unocss/reset/normalize.css"
import "uno.css"

function main() {
  const app = createApp(App)
  setupRouter(app)
  setupStore(app)
  app.mount("#app")
}

void main()