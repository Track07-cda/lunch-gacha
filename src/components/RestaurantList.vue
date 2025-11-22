<script setup>
import { ref } from 'vue'

const props = defineProps({
  restaurants: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['remove', 'update'])

const editingId = ref(null)
const editName = ref('')
const editWeight = ref(1)

const startEdit = (restaurant) => {
  editingId.value = restaurant.id
  editName.value = restaurant.name
  editWeight.value = restaurant.weight
}

const saveEdit = () => {
  if (editingId.value) {
    emit('update', editingId.value, { name: editName.value, weight: editWeight.value })
    editingId.value = null
  }
}

const toggle = (restaurant) => {
  if (editingId.value === restaurant.id) return // Don't toggle while editing
  emit('update', restaurant.id, { enabled: !restaurant.enabled })
}
</script>

<template>
  <div class="restaurant-list">
    <div v-if="restaurants.length === 0" class="empty-state">
      No restaurants added yet. Add some to get started!
    </div>
    
    <transition-group name="list" tag="ul" class="list">
      <li 
        v-for="restaurant in restaurants" 
        :key="restaurant.id" 
        class="list-item"
        :class="{ disabled: restaurant.enabled === false }"
        @click="toggle(restaurant)"
      >
        <div v-if="editingId === restaurant.id" class="edit-mode" @click.stop>
          <input v-model="editName" class="edit-input">
          <input v-model.number="editWeight" type="number" class="edit-weight">
          <button @click="saveEdit" class="btn-icon">✅</button>
          <button @click="cancelEdit" class="btn-icon">❌</button>
        </div>
        <div v-else class="view-mode">
          <div class="info">
            <span class="name">{{ restaurant.name }}</span>
            <div class="weight-badge" title="Weight">
              <span class="weight-icon">⚖️</span>
              {{ restaurant.weight }}
            </div>
          </div>
          <div class="actions">
            <button @click.stop="startEdit(restaurant)" class="btn-icon">✏️</button>
            <button @click.stop="emit('remove', restaurant.id)" class="btn-icon delete">🗑️</button>
          </div>
        </div>
      </li>
    </transition-group>
    <slot name="footer"></slot>
  </div>
</template>

<style scoped>
.restaurant-list {
  width: 100%;
  flex: 1; /* Fill remaining space */
  overflow-y: auto;
  padding-right: 5px;
  min-height: 0; /* Crucial for nested flex scrolling */
}

.empty-state {
  text-align: center;
  padding: 2rem;
  opacity: 0.7;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-item {
  background: rgba(255, 255, 255, 0.05);
  margin-bottom: 8px;
  border-radius: 8px;
  padding: 10px 15px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.list-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.list-item.disabled {
  opacity: 0.5;
  background: rgba(255, 255, 255, 0.02);
}

.view-mode, .edit-mode {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0; /* Allow truncation */
}

.name {
  font-weight: 500;
  font-size: 1.1rem;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.weight-badge {
  font-size: 0.85rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Align icons to the left */
  padding-left: 8px; /* Add padding for visual balance */
  gap: 6px;
  white-space: nowrap;
  color: rgba(255, 255, 255, 0.8);
  min-width: 70px; /* Fixed width for alignment */
  max-width: 70px;
}

.weight-icon {
  font-size: 0.9rem;
  opacity: 0.7;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 5px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.btn-icon:hover {
  opacity: 1;
}

.btn-icon.delete:hover {
  transform: scale(1.1);
}

.edit-input, .edit-weight {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 5px;
  border-radius: 4px;
  color: inherit;
}

.edit-input {
  flex: 2;
  min-width: 40px; /* Allow shrinking on mobile */
}

.edit-weight {
  width: 60px;
}

/* List Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
