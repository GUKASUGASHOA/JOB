<template>
  <div class="profile-page">
    <div class="animated-bg">
      <div class="wave -one"></div>
      <div class="wave -two"></div>
      <div class="wave -three"></div>
    </div>

    <div v-if="user" class="glass-card fade-in">
      <div class="banner"></div>
      
      <div class="profile-content">
        <div class="avatar-section">
          <div class="avatar-ring">
            <div class="avatar-main">
              {{ user.displayName ? user.displayName[0].toUpperCase() : 'S' }}
            </div>
          </div>
          <div class="status-badge">
            <span class="dot"></span> Online
          </div>
        </div>

        <div class="user-details">
          <div v-if="isEditing" class="edit-inputs">
            <input v-model="editData.displayName" class="edit-field" placeholder="Ваше имя" />
            <input v-model="editData.role" class="edit-field sub" placeholder="Ваша роль" />
          </div>
          
          <div v-else>
            <h1>{{ user.displayName || 'Sanzhar' }}</h1>
            <p class="user-role">{{ user.role || 'Front-end Developer' }}</p>
          </div>

          <div class="email-chip">{{ user.email }}</div>
        </div>

        <div class="action-buttons">
          <div v-if="!isEditing">
            <button @click="startEditing" class="btn btn-edit">
              ✏️ Редактировать профиль
            </button>
          </div>
          <div v-else class="edit-actions">
            <button @click="saveProfile" class="btn btn-save" :disabled="isSaving">
              {{ isSaving ? 'Сохранение...' : '✅ Сохранить' }}
            </button>
            <button @click="isEditing = false" class="btn btn-cancel">Отмена</button>
          </div>

          <button @click="handleLogout" class="btn btn-logout">
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>

    <div v-else class="glass-card skeleton">
      <div class="shimmer"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from 'vue-router';

const router = useRouter();
const user = ref(null);
const isEditing = ref(false);
const isSaving = ref(false);

const editData = ref({
  displayName: '',
  role: ''
});

onMounted(() => {
  onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      
      user.value = {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: docSnap.exists() ? docSnap.data().displayName : (currentUser.displayName || 'Sanzhar'),
        role: docSnap.exists() ? docSnap.data().role : 'Front-end Developer'
      };
    } else {
      router.push('/login');
    }
  });
});

const startEditing = () => {
  editData.value.displayName = user.value.displayName;
  editData.value.role = user.value.role;
  isEditing.value = true;
};

const saveProfile = async () => {
  isSaving.value = true;
  try {
    const docRef = doc(db, "users", user.value.uid);
    await setDoc(docRef, {
      role: editData.value.role,
      displayName: editData.value.displayName
    }, { merge: true });

    user.value.displayName = editData.value.displayName;
    user.value.role = editData.value.role;
    isEditing.value = false;
  } catch (e) {
    console.error(e);
    alert("Ошибка сохранения");
  } finally {
    isSaving.value = false;
  }
};

const handleLogout = async () => {
  await signOut(auth);
  router.push('/login');
};
</script>

<style scoped>
/* КОНТЕЙНЕР СТРАНИЦЫ */
.profile-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #080f1a;
  background: radial-gradient(circle at center, #101c30 0%, #080f1a 100%);
  position: relative;
  overflow: hidden;
  padding: 40px 20px;
}

/* ФОНОВЫЕ ВОЛНЫ */
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
  opacity: 0.12;
}
.wave.-one { background: #42b883; animation: drift 18s infinite linear; }
.wave.-two { background: #35495e; animation: drift 22s infinite linear; opacity: 0.08; }
.wave.-three { background: #60efff; animation: drift 26s infinite linear; opacity: 0.05; }

@keyframes drift {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* КАРТОЧКА ПРОФИЛЯ */
.glass-card {
  width: 100%;
  max-width: 480px; /* Увеличено для солидности */
  background: rgba(30, 41, 59, 0.45); 
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 40px;
  position: relative;
  z-index: 10;
  box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.8);
  overflow: hidden;
}

.banner { 
  height: 130px; 
  background: linear-gradient(135deg, #42b883, #1e293b); 
  opacity: 0.8;
}

.profile-content { 
  padding: 0 45px 50px; 
  text-align: center; 
}

/* АВАТАР */
.avatar-section { 
  margin-top: -65px; 
  position: relative; 
  display: inline-block; 
}
.avatar-ring { 
  padding: 6px; 
  background: linear-gradient(135deg, #42b883, #60efff); 
  border-radius: 50%;
  box-shadow: 0 15px 35px rgba(66, 184, 131, 0.4);
}
.avatar-main { 
  width: 115px; height: 115px; 
  background: #0f172a; 
  border-radius: 50%; 
  display: flex; align-items: center; justify-content: center; 
  font-size: 48px; font-weight: 800; color: white; 
  border: 5px solid #0f172a; 
}

.status-badge { 
  position: absolute; bottom: 8px; right: 8px; 
  background: #0f172a; color: #42b883; 
  font-size: 11px; font-weight: bold; 
  padding: 5px 12px; border-radius: 20px; 
  border: 2px solid #42b883;
  display: flex; align-items: center; gap: 5px;
}
.dot { width: 6px; height: 6px; background: #42b883; border-radius: 50%; box-shadow: 0 0 10px #42b883; }

/* ТЕКСТ */
h1 { color: white; margin: 30px 0 8px; font-size: 34px; letter-spacing: -1px; }
.user-role { color: #42b883; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 25px; }
.email-chip { 
  display: inline-block; 
  background: rgba(255, 255, 255, 0.05); color: #94a3b8; 
  padding: 8px 22px; border-radius: 30px; 
  font-size: 14px; margin-bottom: 45px; 
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* КНОПКИ */
.action-buttons { display: flex; flex-direction: column; gap: 15px; }
.btn { 
  padding: 18px; border-radius: 22px; 
  border: none; font-weight: 700; font-size: 16px;
  cursor: pointer; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
  width: 100%;
}

.btn-edit { background: white; color: #0f172a; }
.btn-edit:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(255,255,255,0.2); }

.btn-save { background: #42b883; color: #0f172a; flex: 2; }
.btn-cancel { background: rgba(255, 255, 255, 0.05); color: white; border: 1px solid rgba(255, 255, 255, 0.1); flex: 1; }

.btn-logout { 
  background: transparent; color: #f87171; 
  border: 1px solid rgba(248, 113, 113, 0.2); 
  margin-top: 5px;
}
.btn-logout:hover { background: rgba(248, 113, 113, 0.1); border-color: #f87171; }

/* РЕДАКТИРОВАНИЕ */
.edit-inputs { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
.edit-field { 
  background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(66, 184, 131, 0.4); 
  border-radius: 15px; padding: 12px; color: white; 
  text-align: center; outline: none; font-size: 18px;
}
.edit-field:focus { border-color: #42b883; background: rgba(0, 0, 0, 0.5); }
.edit-field.sub { color: #42b883; font-size: 15px; }
.edit-actions { display: flex; gap: 12px; }

.fade-in { animation: slideUp 0.8s ease-out; }
@keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }

.skeleton { height: 450px; display: flex; align-items: center; justify-content: center; }
.shimmer { width: 60px; height: 60px; border: 4px solid #42b883; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>