<template>
  <div class="auth-page">
    <div class="animated-bg">
      <div class="wave -one"></div>
      <div class="wave -two"></div>
      <div class="wave -three"></div>
    </div>

    <div class="auth-card fade-in">
      <div class="auth-header">
        <div class="logo-icon">S</div>
        <h1>С возвращением!</h1>
        <p>Войдите в Sanzhar<span>News</span></p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="input-group">
          <label>Email</label>
          <div class="input-wrapper">
            <span class="icon">📧</span>
            <input 
              v-model="email" 
              type="email" 
              placeholder="Введите ваш email" 
              required 
            />
          </div>
        </div>

        <div class="input-group">
          <label>Пароль</label>
          <div class="input-wrapper">
            <span class="icon">🔒</span>
            <input 
              v-model="password" 
              type="password" 
              placeholder="Введите пароль" 
              required 
            />
          </div>
        </div>

        <button type="submit" class="btn-auth" :disabled="loading">
          {{ loading ? 'Вход...' : 'Войти в систему' }}
        </button>
      </form>

      <div class="auth-footer">
        <p>Впервые здесь? <router-link to="/register">Создать аккаунт</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const loading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push('/');
  } catch (error) {
    alert("Ошибка входа: проверьте почту или пароль");
    console.error(error.message);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* СТИЛИ ПОЛНОСТЬЮ ДУБЛИРУЮТ REGISTER ДЛЯ ЕДИНСТВА */
.auth-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #080f1a;
  background: radial-gradient(circle at center, #101c30 0%, #080f1a 100%);
  position: relative;
  overflow: hidden;
  padding: 20px;
  font-family: 'Inter', sans-serif;
}

.animated-bg {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 0;
  pointer-events: none;
}
.wave {
  position: absolute;
  bottom: -250px; left: -50%;
  width: 200%; height: 200%;
  border-radius: 42%;
  opacity: 0.1;
}
.wave.-one { background: #42b883; animation: drift 15s infinite linear; }
.wave.-two { background: #35495e; animation: drift 20s infinite linear; }
.wave.-three { background: #60efff; animation: drift 25s infinite linear; opacity: 0.05; }

@keyframes drift { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.auth-card {
  width: 100%;
  max-width: 420px;
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 35px;
  padding: 50px 40px;
  position: relative;
  z-index: 10;
  box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.6);
}

.auth-header { text-align: center; margin-bottom: 40px; }
.logo-icon {
  width: 65px; height: 65px;
  background: linear-gradient(135deg, #42b883, #60efff);
  margin: 0 auto 20px;
  border-radius: 20px;
  display: flex; align-items: center; justify-content: center;
  font-size: 32px; font-weight: 900; color: #0f172a;
  box-shadow: 0 10px 25px rgba(66, 184, 131, 0.3);
}

h1 { color: white; font-size: 30px; margin-bottom: 8px; font-weight: 800; letter-spacing: -0.5px; }
.auth-header p { color: #94a3b8; font-size: 15px; }
.auth-header p span { color: #42b883; font-weight: bold; }

.auth-form { display: flex; flex-direction: column; gap: 25px; }
.input-group { display: flex; flex-direction: column; gap: 10px; }
.input-group label { color: #cbd5e1; font-size: 14px; font-weight: 600; margin-left: 5px; }

.input-wrapper { position: relative; display: flex; align-items: center; }
.icon { position: absolute; left: 18px; font-size: 20px; opacity: 0.8; }

input {
  width: 100%;
  padding: 16px 15px 16px 50px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  color: white;
  font-size: 15px;
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
}

input:focus {
  border-color: #42b883;
  background: rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 0 4px rgba(66, 184, 131, 0.15);
}

.btn-auth {
  background: linear-gradient(90deg, #42b883, #2f9e6b);
  color: #0f172a;
  border: none;
  padding: 18px;
  border-radius: 18px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 10px;
}

.btn-auth:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(66, 184, 131, 0.4);
}

.btn-auth:active { transform: translateY(-1px); }
.btn-auth:disabled { opacity: 0.7; cursor: not-allowed; }

.auth-footer { text-align: center; margin-top: 35px; }
.auth-footer p { color: #94a3b8; font-size: 14px; }
.auth-footer a { color: #42b883; text-decoration: none; font-weight: 700; margin-left: 5px; }
.auth-footer a:hover { text-decoration: underline; }

.fade-in { animation: authAppear 0.7s ease-out; }
@keyframes authAppear {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>