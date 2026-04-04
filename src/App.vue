<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 1. Состояние для открытия меню
const isMenuOpen = ref(false);
const dropdownRef = ref(null);

// 2. Функция переключения (открыть/закрыть)
const toggleMenu = (event) => {
  event.stopPropagation();
  isMenuOpen.value = !isMenuOpen.value;
};

// 3. Закрытие при клике в любое другое место
const closeMenu = () => {
  isMenuOpen.value = false;
};

onMounted(() => {
  window.addEventListener('click', closeMenu);
});

onUnmounted(() => {
  window.removeEventListener('click', closeMenu);
});
</script>

<template>
  <div id="app">
    <header class="navbar">
      <nav class="nav-content">
        <router-link to="/" class="nav-item">Главная</router-link>
      
        <div class="dropdown" ref="dropdownRef">
          <button type="button" @click="toggleMenu" class="dropdown-trigger">
            Аккаунт
            <span class="arrow" :class="{ 'rotate': isMenuOpen }">▼</span>
          </button>

          <transition name="fade">
            <div v-if="isMenuOpen" class="dropdown-menu">
              <router-link to="/profile" class="menu-link" @click="closeMenu">Профиль</router-link>
              <router-link to="/register" class="menu-link" @click="closeMenu">Регистрация</router-link>
              
            </div>
          </transition>
          
        </div>
      </nav>
    </header>

    <main class="page-container">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
/* 1. Навигация сверху по центру */
/* Этот класс должен быть у родительского элемента, в котором лежит карточка */
#app {
  display: flex;
  justify-content: center; /* Центрирует по горизонтали */
  align-items: center;     /* Центрирует по вертикали */
  min-height: 100vh;      /* Растягивает контейнер на всю высоту экрана */
  margin: 0;              /* Убирает отступы по умолчанию, если есть */
  /* Опционально: можно добавить фоновый цвет страницы здесь */
}
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: #1a1a1a;
  padding: 12px 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.nav-content {
  display: flex;
  align-items: center;
  gap: 30px;
}

.nav-item {
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-item:hover, .router-link-active {
  color: #42b883;
}

/* 2. Стили выпадающего списка */
.dropdown {
  position: relative;
}

.dropdown-trigger {
  background: #333;
  color: white;
  border: 1px solid #444;
  padding: 8px 18px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.arrow {
  display: inline-block;
  transition: transform 0.3s;
  font-size: 10px;
}

.rotate {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 130%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  min-width: 160px;
  border-radius: 8px;
  padding: 10px 0;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.menu-link {
  display: block;
  padding: 12px 20px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
}

.menu-link:hover {
  background-color: #f5f5f5;
  color: #42b883;
}

/* 3. Отступ контента сверху */
.page-container {
  margin-top: 80px;
  padding: 20px;
}

/* Анимация */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -10px);
}
</style>