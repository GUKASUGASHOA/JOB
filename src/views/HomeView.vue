<template>
  <div class="home-page">
    <div class="animated-bg">
      <div class="wave -one"></div>
      <div class="wave -two"></div>
      <div class="wave -three"></div>
    </div>

    <div class="content-container">
      <section v-if="userRole === 'Админ'" class="admin-panel fade-in">
        <button @click="showForm = !showForm" class="btn-toggle">
          {{ showForm ? 'Закрыть редактор' : '+ Добавить статью' }}
        </button>

        <div v-if="showForm" class="add-news-form">
          <div class="form-grid">
            <input v-model="newPost.title" type="text" placeholder="Заголовок статьи" />
            <input v-model="newPost.category" type="text" placeholder="Категория (например, Tech)" />
            <input v-model="newPost.image" type="text" placeholder="URL картинки" />
          </div>
          <textarea v-model="newPost.excerpt" placeholder="Краткое описание..."></textarea>
          <textarea v-model="newPost.content" placeholder="Полный текст новости..." rows="5"></textarea>
          
          <button @click="uploadPost" :disabled="isUploading" class="btn-upload">
            {{ isUploading ? 'Публикация...' : 'Опубликовать новость' }}
          </button>
        </div>
      </section>

      <header class="home-header fade-in">
        <h1>Свежие новости</h1>
        <div class="header-line"></div>
      </header>

      <div class="news-grid">
        <div v-for="post in paginatedNews" :key="post.id" class="news-card fade-in">
          <div class="card-image" :style="{ backgroundImage: `url(${post.image || 'https://via.placeholder.com/400x200'})` }">
            <span class="category">{{ post.category || 'Общее' }}</span>
            
            <button v-if="userRole === 'Админ'" @click="deletePost(post.id)" class="btn-delete" title="Удалить">🗑️</button>
          </div>
          
          <div class="card-body">
            <span class="date">{{ post.date }}</span>
            <h3>{{ post.title }}</h3>
            <p>{{ post.excerpt }}</p>
            
            <div class="card-footer">
              <button @click="$router.push('/news/' + post.id)" class="read-more">
                Читать далее
              </button>
              <div @click="likePost(post.id)" class="likes">
                ❤️ {{ post.likes || 0 }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="totalPages > 1" class="pagination fade-in">
        <button @click="currentPage--" :disabled="currentPage === 1" class="page-btn">←</button>
        <span class="page-info">Стр. {{ currentPage }} / {{ totalPages }}</span>
        <button @click="currentPage++" :disabled="currentPage === totalPages" class="page-btn">→</button>
      </div>
    </div>

    <footer class="home-footer">
      <div class="footer-content">
        <div class="footer-logo">Sanzhar<span>News</span></div>
        <p>© 2026 Все права защищены. Сделано на Vue.js</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { db, auth } from '../firebase'; // Добавлен импорт auth
import { collection, addDoc, query, orderBy, onSnapshot, doc, updateDoc, increment, deleteDoc, getDoc } from "firebase/firestore";

const news = ref([]);
const showForm = ref(false);
const isUploading = ref(false);
const currentPage = ref(1);
const postsPerPage = 6;
const userRole = ref(null); // Переменная для хранения роли

const newPost = ref({ title: '', excerpt: '', content: '', image: '', category: '', likes: 0 });

onMounted(() => {
  // 1. Получаем новости
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  onSnapshot(q, (snapshot) => {
    news.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });

  // 2. Проверяем роль залогиненного пользователя
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        userRole.value = userDoc.data().role;
        console.log("Текущая роль:", userRole.value);
      }
    } else {
      userRole.value = null;
    }
  });
});

const totalPages = computed(() => Math.ceil(news.value.length / postsPerPage));
const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage;
  return news.value.slice(start, start + postsPerPage);
});

const likePost = async (id) => {
  await updateDoc(doc(db, "posts", id), { likes: increment(1) });
};

const deletePost = async (id) => {
  if (confirm("Удалить статью?")) {
    try {
      await deleteDoc(doc(db, "posts", id));
    } catch (e) {
      alert("Ошибка доступа: только админ может удалять.");
    }
  }
};

const uploadPost = async () => {
  if (!newPost.value.title) return;
  isUploading.value = true;
  await addDoc(collection(db, "posts"), {
    ...newPost.value,
    date: new Date().toLocaleDateString('ru-RU'),
    createdAt: Date.now()
  });
  newPost.value = { title: '', excerpt: '', content: '', image: '', category: '', likes: 0 };
  showForm.value = false;
  isUploading.value = false;
};
</script>

<style scoped>
/* Твои стили без изменений */
.home-page {
  min-height: 100vh;
  background: #080f1a;
  background: radial-gradient(circle at center, #101c30 0%, #080f1a 100%);
  position: relative;
  overflow-x: hidden;
  padding-top: 80px;
  color: white;
}

.animated-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; }
.wave { position: absolute; bottom: -200px; left: -50%; width: 200%; height: 200%; border-radius: 40%; opacity: 0.1; }
.wave.-one { background: #42b883; animation: drift 15s infinite linear; }
.wave.-two { background: #35495e; animation: drift 20s infinite linear; }
@keyframes drift { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.content-container {
  width: 92%;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.home-header { text-align: center; margin-bottom: 40px; }
.home-header h1 { font-size: 3.5rem; font-weight: 800; letter-spacing: -1px; }
.header-line { width: 80px; height: 5px; background: #42b883; margin: 10px auto; border-radius: 10px; }

.admin-panel { margin-bottom: 40px; text-align: center; }
.btn-toggle { background: #42b883; color: #0f172a; border: none; padding: 12px 30px; border-radius: 15px; font-weight: 800; cursor: pointer; }

.add-news-form { 
  background: rgba(30, 41, 59, 0.7); 
  padding: 30px; 
  border-radius: 24px; 
  margin: 20px auto 0; 
  border: 1px solid rgba(66, 184, 131, 0.3); 
  display: flex; flex-direction: column; gap: 15px;
  max-width: 800px;
  box-sizing: border-box;
}

.form-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
  gap: 15px; 
}

.add-news-form input, .add-news-form textarea { 
  background: rgba(0, 0, 0, 0.4); border: 1px solid #334155; 
  padding: 15px; border-radius: 12px; color: white; outline: none; 
  box-sizing: border-box; min-width: 0;
}

.btn-upload { background: linear-gradient(90deg, #42b883, #60efff); color: #0f172a; border: none; padding: 15px; border-radius: 12px; font-weight: 800; cursor: pointer; }

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

.news-card {
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  overflow: hidden;
  transition: 0.3s ease;
}
.news-card:hover { transform: translateY(-8px); border-color: rgba(66, 184, 131, 0.4); }

.card-image { height: 230px; background-size: cover; background-position: center; position: relative; }
.category { position: absolute; top: 15px; left: 15px; background: #42b883; color: #0f172a; padding: 5px 12px; border-radius: 10px; font-weight: bold; font-size: 0.75rem; }
.btn-delete { position: absolute; top: 15px; right: 15px; background: rgba(248, 113, 113, 0.2); border: none; padding: 8px; border-radius: 10px; cursor: pointer; color: white; backdrop-filter: blur(5px); }

.card-body { padding: 25px; }
.card-body h3 { font-size: 1.5rem; margin: 10px 0; font-weight: 700; line-height: 1.2; }
.card-body p { color: #94a3b8; line-height: 1.6; font-size: 0.95rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.date { color: #42b883; font-size: 0.85rem; font-weight: 600; }

.card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 25px; }
.read-more { background: white; color: #0f172a; border: none; padding: 10px 20px; border-radius: 12px; font-weight: 800; cursor: pointer; }
.likes { background: rgba(255,255,255,0.05); padding: 8px 15px; border-radius: 12px; cursor: pointer; font-size: 0.9rem; }

.pagination { display: flex; justify-content: center; align-items: center; gap: 15px; margin-bottom: 80px; }
.page-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 10px 18px; border-radius: 12px; cursor: pointer; }

.home-footer { padding: 60px 0; background: #050a12; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); }
.footer-logo { font-size: 1.8rem; font-weight: 900; }
.footer-logo span { color: #42b883; }

@media (max-width: 1024px) {
  .news-grid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
  .home-header h1 { font-size: 2.8rem; }
}

@media (max-width: 768px) {
  .home-page { padding-top: 60px; }
  .home-header h1 { font-size: 2.2rem; }
  .content-container { width: 94%; }
  .add-news-form { padding: 20px; }
  .form-grid { grid-template-columns: 1fr; }
  .news-grid { grid-template-columns: 1fr; }
  .card-image { height: 200px; }
  .card-body h3 { font-size: 1.3rem; }
}

@media (max-width: 480px) {
  .home-header h1 { font-size: 1.8rem; }
  .btn-toggle { width: 100%; padding: 15px; }
  .read-more { padding: 8px 15px; font-size: 0.85rem; }
  .page-info { font-size: 0.8rem; }
}

.fade-in { animation: fadeInUp 0.8s ease-out; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
</style>