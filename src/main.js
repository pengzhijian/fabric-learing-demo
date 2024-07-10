import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import '@/assets/reset.scss'
import App from './App.vue'
import router from './router'
import { setupProdMockServer } from '@/mock';
if (process.env.NODE_ENV === 'production') {
  setupProdMockServer();
}
const app = createApp(App)

app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.mount('#app')
