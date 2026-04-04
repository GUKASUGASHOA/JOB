import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyABDnelVeerGegqaOGLwTx3WxgpXi3_Lks",
    authDomain: "hheifhow.firebaseapp.com",
    projectId: "hheifhow",
    storageBucket: "hheifhow.firebasestorage.app",
    messagingSenderId: "426520013271",
    appId: "1:426520013271:web:e0ee7e1d3bbaccb3714392",
    measurementId: "G-T3P6SQJM8Q"
  };
const app = initializeApp(firebaseConfig);

// 2. Создаем переменную auth (ВАЖНО!)
const auth = getAuth(app); 
export const db = getFirestore(app);
// 3. Экспортируем её
export { auth };