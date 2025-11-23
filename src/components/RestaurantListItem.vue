<script setup>
import { ref, nextTick } from 'vue'

const props = defineProps({
  restaurant: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update', 'remove'])

const isEditing = ref(false)
const editName = ref('')
const editWeight = ref(1)
const nameInput = ref(null)
const hasError = ref(false)

const startEdit = () => {
  editName.value = props.restaurant.name
  editWeight.value = props.restaurant.weight
  isEditing.value = true
  nextTick(() => {
    nameInput.value?.focus()
  })
}

const saveEdit = () => {
  const isValidName = editName.value.trim().length > 0
  const isValidWeight = editWeight.value >= 0 && Number.isInteger(editWeight.value)

  if (isValidName && isValidWeight) {
    emit('update', props.restaurant.id, { 
      name: editName.value, 
      weight: editWeight.value 
    })
    isEditing.value = false
    hasError.value = false
  } else {
    hasError.value = true
  }
}

const cancelEdit = () => {
  isEditing.value = false
  hasError.value = false
}

const toggle = () => {
  if (isEditing.value) return
  emit('update', props.restaurant.id, { enabled: !props.restaurant.enabled })
}
</script>

<template>
  <li 
    class="list-item"
    :class="{ disabled: restaurant.enabled === false }"
    @click="toggle"
  >
    <div v-if="isEditing" class="edit-mode" @click.stop>
      <input 
        ref="nameInput"
        v-model="editName" 
        class="edit-input"
        :class="{ 'input-error': hasError && !editName.trim() }"
        @keyup.enter="saveEdit"
        @keyup.esc="cancelEdit"
      >
      <input 
        v-model.number="editWeight" 
        type="number" 
        min="0"
        step="1"
        class="edit-weight"
        :class="{ 'input-error': hasError && (editWeight < 0 || !Number.isInteger(editWeight)) }"
        @keyup.enter="saveEdit"
        @keyup.esc="cancelEdit"
      >
      <button @click="saveEdit" class="btn-icon" title="Save">✅</button>
      <button @click="cancelEdit" class="btn-icon" title="Cancel">❌</button>
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
        <button @click.stop="startEdit" class="btn-icon" title="Edit">✏️</button>
        <button @click.stop="emit('remove', restaurant.id)" class="btn-icon delete" title="Delete">🗑️</button>
      </div>
    </div>
  </li>
</template>

<style scoped>
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
  justify-content: flex-start;
  padding-left: 8px;
  gap: 6px;
  white-space: nowrap;
  color: rgba(255, 255, 255, 0.8);
  min-width: 70px;
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
  min-width: 40px;
}

.edit-weight {
  width: 60px;
}

.input-error {
  border-color: #ff4444 !important;
  background: rgba(255, 68, 68, 0.1);
}
</style>
