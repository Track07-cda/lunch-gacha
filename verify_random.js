import { pickWeighted } from './src/utils/random.js'

const runTest = (items, iterations = 100000) => {
    const counts = {}
    items.forEach(i => counts[i.name] = 0)

    for (let i = 0; i < iterations; i++) {
        const picked = pickWeighted(items)
        if (picked) {
            counts[picked.name]++
        }
    }

    console.log('--- Test Results ---')
    console.log('Total Iterations:', iterations)
    const totalWeight = items.reduce((sum, item) => sum + (Number(item.weight) || 0), 0)
    items.forEach(item => {
        const count = counts[item.name]
        const percentage = (count / iterations) * 100
        const weight = Number(item.weight) || 0
        const expected = totalWeight > 0 ? (weight / totalWeight) * 100 : 0
        console.log(`${item.name} (Weight ${item.weight}): ${count} (${percentage.toFixed(2)}%) - Expected: ${expected.toFixed(2)}%`)
    })
}

// Test Case 1: Equal weights
console.log('\nTest 1: Equal Weights (1, 1, 1)')
runTest([
    { name: 'A', weight: 1 },
    { name: 'B', weight: 1 },
    { name: 'C', weight: 1 }
])

// Test Case 2: Skewed weights
console.log('\nTest 2: Skewed Weights (1, 10, 1)')
runTest([
    { name: 'A', weight: 1 },
    { name: 'B', weight: 10 },
    { name: 'C', weight: 1 }
])

// Test Case 3: Progressive weights
console.log('\nTest 3: Progressive Weights (1, 2, 3)')
runTest([
    { name: 'A', weight: 0.2 },
    { name: 'B', weight: 2 },
    { name: 'C', weight: 3 }
])

// Test Case 4: Many items (10 items, weight 1 each)
console.log('\nTest 3: Many items (10 items, weight 1 each)')
const manyItems = Array.from({ length: 10 }, (_, i) => ({ name: `Item${i}`, weight: 1 }))
runTest(manyItems)

// Test Case 4: Edge cases (0 weight, invalid weight)
console.log('\nTest 4: Edge Cases')
runTest([
    { name: 'Valid', weight: 10 },
    { name: 'Zero', weight: 0 },
    { name: 'Invalid', weight: 'abc' }, // Should be 0
    { name: 'StringNum', weight: '10' } // Should be 10
])
