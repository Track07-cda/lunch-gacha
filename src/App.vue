<script setup>
import { ref } from 'vue'
import { useRestaurants } from './composables/useRestaurants'
import RestaurantList from './components/RestaurantList.vue'
import RestaurantForm from './components/RestaurantForm.vue'
import GachaponMachine from './components/GachaponMachine.vue'

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
      <h1>🍱 Lunch Gotcha</h1>
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
          
          <RestaurantForm @add="addRestaurant" />
          <RestaurantList 
            :restaurants="restaurants" 
            @remove="removeRestaurant"
            @update="updateRestaurant"
          />
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
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 50;
}

h1 {
  font-size: 1.5rem;
  margin: 0;
  background: linear-gradient(to right, #ff9a9e, #fad0c4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-controls {
  display: flex;
  gap: 10px;
  background: rgba(0, 0, 0, 0.2);
  padding: 5px;
  border-radius: 20px;
}

.nav-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  padding: 5px 15px;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-btn.active {
  background: white;
  color: #333;
  font-weight: bold;
}

.main-content {
  flex: 1;
  padding: 1rem;
  position: relative;
}

.data-controls {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 1rem;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

.hidden {
  display: none;
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
