import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import App from './App.vue';
import router from './router';

import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi', // กำหนดให้ใช้ MDI เป็นชุดไอคอนเริ่มต้น
  },
  components,
  directives,
});
  
const app = createApp(App);

app.use(router);
app.use(vuetify);

app.mount('#app');
