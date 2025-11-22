<script setup>
import RestaurantListItem from './RestaurantListItem.vue'

const props = defineProps({
  restaurants: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['remove', 'update'])

const handleUpdate = (id, updates) => {
  emit('update', id, updates)
}

const handleRemove = (id) => {
  emit('remove', id)
}
</script>

<template>
  <div class="restaurant-list">
    <div v-if="restaurants.length === 0" class="empty-state">
      No restaurants added yet. Add some to get started!
    </div>
    
    <transition-group name="list" tag="ul" class="list">
      <RestaurantListItem
        v-for="restaurant in restaurants"
        :key="restaurant.id"
        :restaurant="restaurant"
        @update="handleUpdate"
        @remove="handleRemove"
      />
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
