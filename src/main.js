import 'babel-polyfill'
import 'zepto/src/zepto'
import 'zepto/src/event'
import 'zepto/src/ajax'
import '@/static/css/reset.scss'
import '@/bag/plugins/ext'
import '@/bag/plugins/EZGesture'
import '@/bag/plugins/canvas2image'
import VueLazyload from 'vue-lazyload'

import Vue from 'vue'
import App from './App'
import router from './router/r'
import * as _ajax from '@/static/js/requestSupport'
import loading from '@/bag/vueCommon/loading/1/loading'
import ut from '@/bag/utils/index.js'
import reminderMsg from '@/bag/vueCommon/errMsg/2/index.js'
import infiniteScroll from 'vue-infinite-scroll'

import axios from 'axios'
import VueAwesomeSwiper from 'vue-awesome-swiper'

import 'swiper/dist/idangerous.swiper.css'

Vue.use(VueAwesomeSwiper, /* { default global options } */)

Vue.use(infiniteScroll)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: "static/img/loaderr.png",
  attempt: 1,
  listenEvents: ['scroll'],
  observer: true,
  observerOptions: {
    rootMargin: '0px',
    threshold: 0.1
  },
  filter: {
    webp(listener, options) {
      if (!options.supportWebp) return;
      const isCDN = /^(http|https):\/\/b612/;
      if (isCDN.test(listener.src)) {
        listener.src += '?x-oss-process=image/format,webp'
      }
    }
  }
});

console.log(window.location);
let mixins = {
  install(vue, options) {
    vue.prototype.$ut = ut,
    vue.prototype.$loading = loading,
    vue.prototype.$ajax = _ajax,
Vue.prototype.$http = axios

    vue.prototype.$userState = {}
  }
}
Vue.use(mixins)
Vue.use(reminderMsg)
/* eslint-disable no-new */

Vue.use(VueLazyload, {
    error:require('@/static/img/blank.jpg'),
    loading:require('@/static/img/blank.jpg')
})
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
