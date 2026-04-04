
import { createRouter, createWebHistory } from 'vue-router';
import Register from '../views/Register.vue';
import ProfileView from '../views/ProfileView.vue';
import HomeView from '../views/HomeView.vue';
import Login from '../views/Login.vue';
const routes = [
  { path: '/',  component: HomeView }, // По умолчанию кидаем на регистрацию
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/profile', component: ProfileView },
  { path: '/news/:id', name: 'NewsDetail', component: () => import('../views/NewsDetail.vue') }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;