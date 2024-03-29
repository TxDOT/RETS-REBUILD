import { createApp } from 'vue'
import "@arcgis/core/assets/esri/themes/dark/main.css";
import './style.css'
import App from './App.vue'

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import router from './router/index.js';


const vuetify = createVuetify({
    components,
    directives,
    icons:{
      defaultSet: 'mdi'
    },
    theme: {
      defaultTheme: 'dark'
    }
  })
  
createApp(App).use(vuetify).use(router).mount('#app')
