import { createApp } from 'vue'
import App from './App.vue'

(async () => {
	const { createPinia } = await import('pinia')
	const app = createApp(App)
	app.use(createPinia())
	app.mount('#app')
})()