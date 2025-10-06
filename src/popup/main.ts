import { createApp } from "vue"
import App from "./App.vue"
import "../style.css"

import { createRouter, createWebHistory } from "vue-router"
import { handleHotUpdate, routes } from "vue-router/auto-routes"

routes.push({
  path: "/:catchAll(.*)*",
  redirect: "/",
})

const appRouter = createRouter({
  history: createWebHistory(),
  routes,
})

appRouter.addRoute({
  path: "/",
  redirect: "/index",
})

if (import.meta.hot) {
  handleHotUpdate(appRouter)
}

createApp(App).use(appRouter).mount("#app")
