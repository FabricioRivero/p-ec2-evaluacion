import { createApp, type DefineComponent } from 'vue'
import { createPinia } from 'pinia'

declare module '*.vue' {
  const component: DefineComponent<{}, {}, any>
  export default component
}

import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')