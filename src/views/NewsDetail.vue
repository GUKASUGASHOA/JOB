<template>
  <div class="detail-page">
    <div class="animated-bg">
      <div class="wave -one"></div>
      <div class="wave -two"></div>
      <div class="wave -three"></div>
    </div>

    <div v-if="post" class="content-container fade-in">
      <button @click="$router.push('/')" class="btn-back">← Назад</button>
      
      <div class="full-post-card">
        <div class="post-header" :style="{ backgroundImage: `url(${post.image})` }"></div>
        
        <div class="post-body">
          <span class="category">{{ post.category }}</span>
          <h1>{{ post.title }}</h1>
          <p class="date">{{ post.date }}</p>
          
          <div class="full-text">
            {{ post.content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { db } from '../firebase';
import { doc, getDoc } from "firebase/firestore";

const route = useRoute();
const post = ref(null);

onMounted(async () => {
  const docRef = doc(db, "posts", route.params.id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    post.value = docSnap.data();
  }
});
</script>

<style scoped>
.detail-page { 
  min-height: 100vh; 
  background: radial-gradient(circle at center, #101c30 0%, #080f1a 100%); 
  padding: 40px 20px; 
  color: white; 
  position: relative;
  overflow-x: hidden;
}

.animated-bg {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 0;
}

.wave {
  position: absolute;
  bottom: -200px; left: -50%; width: 200%; height: 200%;
  border-radius: 40%;
  opacity: 0.1;
}
.wave.-one { background: #42b883; animation: drift 15s infinite linear; }
.wave.-two { background: #35495e; animation: drift 20s infinite linear; opacity: 0.08; }
.wave.-three { background: #203a55; animation: drift 25s infinite linear; opacity: 0.05; }

@keyframes drift {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.content-container { 
  max-width: 800px; 
  margin: 0 auto; 
  position: relative; 
  z-index: 1; 
}

.btn-back { 
  background: rgba(255,255,255,0.1); 
  color: white; 
  border: 1px solid rgba(255,255,255,0.2); 
  padding: 10px 20px; 
  border-radius: 12px; 
  cursor: pointer; 
  margin-bottom: 20px; 
  backdrop-filter: blur(5px);
  transition: 0.3s;
}

.full-post-card { 
  background: rgba(30, 41, 59, 0.7); 
  backdrop-filter: blur(15px); 
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 30px; 
  overflow: hidden; 
}

/* 1. ПОДНЯЛИ ТЕКСТ ВЫШЕ: уменьшили высоту картинки */
.post-header { 
  height: 250px; 
  background-size: cover; 
  background-position: center; 
}

/* 2. ПОДНЯЛИ ТЕКСТ ВЫШЕ: уменьшили верхний отступ */
.post-body { padding: 25px 40px; }

.category {
  background: #42b883; /* Добавил цвет, чтобы было видно */
  color: #0f172a;
  padding: 5px 15px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 0.8rem;
}

h1 { font-size: 2.2rem; margin: 10px 0; }
.date { color: #64748b; margin-bottom: 15px; font-size: 0.9rem;}

/* 3. РЕАЛЬНЫЕ ДАННЫЕ: сохраняем абзацы и переносы строк */
.full-text { 
  line-height: 1.8; 
  color: #cbd5e1; 
  font-size: 1.1rem; 
  white-space: pre-wrap; /* Это сохранит твои абзацы из textarea */
}

.fade-in { animation: fadeIn 0.8s ease-out; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>