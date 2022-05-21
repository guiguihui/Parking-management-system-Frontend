import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/gloable.css'
import ElementUI from 'element-ui';
import request from "@/utils/request";
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

Vue.prototype.request=request

Vue.use(ElementUI, { size: "mini" });

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

