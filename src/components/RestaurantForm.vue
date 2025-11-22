<script setup>
import { ref } from 'vue'

const emit = defineEmits(['add'])

const name = ref('')
const weight = ref(1)

const handleSubmit = () => {
  if (!name.value.trim()) return
  
  emit('add', name.value, weight.value)
  name.value = ''
  weight.value = 1
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="restaurant-form">
    <div class="form-group">
      <input 
        v-model="name" 
        type="text" 
        placeholder="Restaurant Name" 
        required
        class="input-name"
      >
      <div class="weight-control">
        <label>⚖️</label>
        <input 
          v-model.number="weight" 
          type="number" 
          min="0" 
          step="1"
          class="input-weight"
        >
      </div>
    </div>
    <button type="submit" class="btn-add">Add</button>
  </form>
</template>

<style scoped>
.restaurant-form {
  display: flex;
  gap: 10px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  margin-bottom: 1rem;
  align-items: center;
}

.form-group {
  display: flex;
  flex: 1;
  gap: 10px;
  align-items: center;
}

.input-name {
  flex: 2;
  min-width: 80px; /* Reduced min-width to allow fitting */
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: inherit;
}

.weight-control {
  display: flex;
  align-items: center;
  gap: 5px;
  flex: 1;
}

.input-weight {
  width: 60px;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: inherit;
}

.btn-add {
  padding: 8px 20px;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
  flex-shrink: 0; /* Prevent squashing */
}

.btn-add:hover {
  transform: translateY(-2px);
}

@media (max-width: 480px) {
  .restaurant-form {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .form-group {
    flex-direction: column;
    align-items: stretch;
  }

  .input-name {
    width: 100%;
  }

  .weight-control {
    width: 100%;
    justify-content: space-between;
  }

  .btn-add {
    width: 100%;
  }
}
</style>
