import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router/router';
import store from './store/store';
import App from './App.vue'
import vuetify from './plugins/vuetify';
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'
import './sass/main.scss'
import { mapActions } from 'vuex';

Vue.use(VueAxios, axios, vuetify);

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    return next();
});

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app');