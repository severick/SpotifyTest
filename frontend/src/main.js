import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'
import axios from 'axios'

Vue.config.productionTip = false
const http = axios.create({
  baseURL: 'http://localhost:8888'
});

Vue.prototype.$http = http;
Vue.use(BootstrapVue);

new Vue({
  render: h => h(App),
}).$mount('#app')
