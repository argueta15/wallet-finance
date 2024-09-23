import { createPinia } from 'pinia'
import { App } from 'vue'

export default ({ app }: { app: App }) => {
  const pinia = createPinia()
  app.use(pinia)
}