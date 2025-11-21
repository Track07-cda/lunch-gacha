<script setup>
import { ref } from 'vue'
import { useRestaurants } from './composables/useRestaurants'
import RestaurantList from './components/RestaurantList.vue'
import RestaurantForm from './components/RestaurantForm.vue'
import GachaponMachine from './components/GachaponMachine.vue'
import logoUrl from './assets/logo.png'

const { 
  restaurants, 
  addRestaurant, 
  removeRestaurant, 
  updateRestaurant, 
  exportData, 
  importData 
} = useRestaurants()

const mode = ref('list') // 'list' or 'gacha'
const fileInput = ref(null)

const handleImport = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  try {
    await importData(file)
    alert('Import successful!')
  } catch (e) {
    alert('Import failed: ' + e.message)
  }
  event.target.value = ''
}

const triggerFileInput = () => {
  fileInput.value.click()
}
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="logo-container">
        <img :src="logoUrl" alt="Lunch Gacha Logo" class="app-logo" />
        <h1>Lunch Gacha</h1>
      </div>
      <nav class="nav-controls">
        <button 
          @click="mode = 'list'" 
          :class="{ active: mode === 'list' }"
          class="nav-btn"
        >
          List
        </button>
        <button 
          @click="mode = 'gacha'" 
          :class="{ active: mode === 'gacha' }"
          class="nav-btn"
        >
          Gacha
        </button>
      </nav>
    </header>

    <main class="main-content">
      <transition name="fade" mode="out-in">
        <div v-if="mode === 'list'" key="list" class="list-view">
          <RestaurantForm @add="addRestaurant" />
          <RestaurantList 
            :restaurants="restaurants" 
            @remove="removeRestaurant"
            @update="updateRestaurant"
          />
          
          <div class="data-controls">
            <button @click="exportData" class="btn-secondary">Export JSON</button>
            <button @click="triggerFileInput" class="btn-secondary">Import JSON</button>
            <input 
              ref="fileInput" 
              type="file" 
              accept=".json" 
              class="hidden" 
              @change="handleImport"
            >
          </div>
        </div>

        <div v-else key="gacha" class="gacha-view">
          <GachaponMachine :restaurants="restaurants" />
        </div>
      </transition>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  max-width: 600px;
  margin: 0 auto;
  height: 100vh; /* Fixed height to prevent body scroll */
  display: flex;
  flex-direction: column;
  background: transparent; /* Let body background show */
}

.app-header {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.2); /* Darker, more subtle */
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 50;
  flex-shrink: 0;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.app-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}


h1 {
  font-size: 1.2rem; /* Slightly smaller, more elegant */
  font-weight: 700;
  margin: 0;
  background: linear-gradient(to right, #ff9a9e, #fad0c4);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.5px;
}

.nav-controls {
  display: flex;
  gap: 5px;
  background: rgba(0, 0, 0, 0.3);
  padding: 4px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.nav-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  padding: 6px 16px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.85rem;
  font-weight: 500;
}

.nav-btn.active {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.main-content {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.list-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 1rem;
  gap: 1rem;
}

.data-controls {
  display: flex;
  justify-content: center; /* Center buttons */
  gap: 15px;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
}

.btn-secondary {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: rgba(255, 255, 255, 0.4);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

.hidden {
  display: none;
}

.gacha-view {
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
