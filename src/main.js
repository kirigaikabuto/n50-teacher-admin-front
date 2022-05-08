import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import "materialize-css/dist/js/materialize.min"
import dateFilter from "./filters/date.filter";
import 'video.js/dist/video-js.css'
import VueVideoPlayer from 'vue-video-player'

Vue.config.productionTip = false
Vue.filter('date', dateFilter)

new Vue({
    VueVideoPlayer,
    router,
    store,
    render: h => h(App)
}).$mount('#app')
