import { ref, watch } from 'vue'

const STORAGE_KEY = 'lunch-gotcha-restaurants'

export function useRestaurants() {
    const restaurants = ref([])

    // Load from local storage
    const load = () => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            try {
                const data = JSON.parse(stored)
                restaurants.value = data.map(r => ({
                    ...r,
                    enabled: r.enabled ?? true
                }))
            } catch (e) {
                console.error('Failed to parse restaurants', e)
                restaurants.value = []
            }
        }
    }

    // Save to local storage
    const save = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(restaurants.value))
    }

    // Watch for changes
    watch(restaurants, save, { deep: true })

    const addRestaurant = (name, weight = 1) => {
        restaurants.value.push({
            id: Date.now(),
            name,
            weight: Number(weight),
            enabled: true
        })
    }

    const removeRestaurant = (id) => {
        restaurants.value = restaurants.value.filter(r => r.id !== id)
    }

    const updateRestaurant = (id, updates) => {
        const index = restaurants.value.findIndex(r => r.id === id)
        if (index !== -1) {
            restaurants.value[index] = { ...restaurants.value[index], ...updates }
        }
    }

    const exportData = () => {
        const dataStr = JSON.stringify(restaurants.value, null, 2)
        const blob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'restaurants.json'
        a.click()
        URL.revokeObjectURL(url)
    }

    const importData = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result)
                    if (Array.isArray(data)) {
                        // Ensure all items have enabled property
                        restaurants.value = data.map(r => ({
                            ...r,
                            enabled: r.enabled ?? true
                        }))
                        resolve(true)
                    } else {
                        reject(new Error('Invalid format'))
                    }
                } catch (err) {
                    reject(err)
                }
            }
            reader.readAsText(file)
        })
    }

    // Initial load
    load()

    return {
        restaurants,
        addRestaurant,
        removeRestaurant,
        updateRestaurant,
        exportData,
        importData
    }
}
