import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "bootstrap/dist/css/bootstrap.css"
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueClickAway from "vue3-click-away"

library.add(fas)

createApp(App).component('font-awesome-icon', FontAwesomeIcon).use(router).use(store).use(VueClickAway).mount('#app')

import "bootstrap/dist/js/bootstrap.js"