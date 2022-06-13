import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 导入elementUI和样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 导入el-icon
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import MyCart from '@/components/card.vue'
import 'default-passive-events'
const app = createApp(App)
app.component(MyCart.name, MyCart)
app.use(router).use(ElementPlus).mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
