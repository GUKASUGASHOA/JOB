import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";


createApp(App).mount('#app')

  

  const firebaseConfig = {
    apiKey: "AIzaSyABDnelVeerGegqaOGLwTx3WxgpXi3_Lks",
    authDomain: "hheifhow.firebaseapp.com",
    projectId: "hheifhow",
    storageBucket: "hheifhow.firebasestorage.app",
    messagingSenderId: "426520013271",
    appId: "1:426520013271:web:e0ee7e1d3bbaccb3714392",
    measurementId: "G-T3P6SQJM8Q"
  };
  const firebaseApp = initializeApp(firebaseConfig);

  const auth = getAuth(firebaseApp);
 const app = createApp(App)
  
  app.use(router); // Подключаем роутер
  app.mount('#app')
  export { auth };
  