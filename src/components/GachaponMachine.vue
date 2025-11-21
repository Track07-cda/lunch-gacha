<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Matter from 'matter-js'
import { pickWeighted } from '../utils/random'

const props = defineProps({
  restaurants: {
    type: Array,
    required: true
  }
})

const canvasRef = ref(null)
const containerRef = ref(null)
const isSpinning = ref(false)
const showResult = ref(false)
const result = ref(null)

// Matter.js variables
let engine = null
let render = null
let runner = null
let capsules = []
let wallBottom = null

const COLORS = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#ff9f43', '#54a0ff', '#5f27cd']

const initPhysics = () => {
  if (!canvasRef.value || !containerRef.value) return

  // Cleanup if exists
  if (engine) {
    Matter.Render.stop(render)
    Matter.Runner.stop(runner)
    Matter.Engine.clear(engine)
    render.canvas.remove()
    render.canvas = null
    render.context = null
    render.textures = {}
  }

  const width = 300
  const height = 400

  // Create Engine
  engine = Matter.Engine.create()
  engine.gravity.y = 0.5 // Reduced gravity
  
  // Create Renderer
  render = Matter.Render.create({
    element: containerRef.value,
    engine: engine,
    canvas: canvasRef.value,
    options: {
      width,
      height,
      wireframes: false,
      background: 'transparent',
      pixelRatio: window.devicePixelRatio
    }
  })

  // Create Walls (Dome shape approximation)
  const wallThickness = 20
  const domeRadius = 140
  const centerX = width / 2
  const centerY = 160 // Center of the dome

  const walls = [
    // Left vertical wall (lower part)
    Matter.Bodies.rectangle(centerX - domeRadius, centerY + 100, wallThickness, 200, { isStatic: true, render: { visible: false } }),
    // Right vertical wall (lower part)
    Matter.Bodies.rectangle(centerX + domeRadius, centerY + 100, wallThickness, 200, { isStatic: true, render: { visible: false } }),
  ]

  // Create dome top using multiple segments
  const segments = 10
  for (let i = 0; i < segments; i++) {
    const angle = Math.PI + (Math.PI * i) / (segments - 1) // From PI to 2PI (semicircle)
    const x = centerX + domeRadius * Math.cos(angle)
    const y = centerY + domeRadius * Math.sin(angle)
    
    const segment = Matter.Bodies.rectangle(x, y, 50, wallThickness, {
      isStatic: true,
      angle: angle + Math.PI / 2,
      render: { visible: false }
    })
    walls.push(segment)
  }

  // Bottom Gate (The part that opens)
  wallBottom = Matter.Bodies.rectangle(centerX, height - 10, width, 20, { 
    isStatic: true,
    render: { fillStyle: '#333' }
  })

  // Invisible funnel walls to guide balls to the hole
  const funnelLeft = Matter.Bodies.rectangle(centerX - 60, height - 60, 100, 20, { 
    isStatic: true, 
    angle: Math.PI / 4,
    render: { visible: false } 
  })
  const funnelRight = Matter.Bodies.rectangle(centerX + 60, height - 60, 100, 20, { 
    isStatic: true, 
    angle: -Math.PI / 4,
    render: { visible: false } 
  })

  Matter.Composite.add(engine.world, [...walls, wallBottom, funnelLeft, funnelRight])

  // Add Capsules
  createCapsules()

  // Run
  runner = Matter.Runner.create()
  Matter.Runner.run(runner, engine)
  Matter.Render.run(render)
}

const createCapsules = () => {
  // Remove existing
  if (capsules.length > 0) {
    Matter.Composite.remove(engine.world, capsules)
  }

  capsules = []
  const count = Math.min(15, Math.max(3, props.restaurants.length)) // Reduced count: 3 to 15 balls
  
  for (let i = 0; i < count; i++) {
    const radius = 25 
    // Spawn closer to center to avoid walls
    const x = Math.random() * 100 + 100 // 100-200
    const y = Math.random() * 100 + 100 // 100-200
    const color = COLORS[i % COLORS.length]
    
    const circle = Matter.Bodies.circle(x, y, radius, {
      restitution: 0.5, // Less bouncy
      friction: 0.01,
      frictionAir: 0.02, // More air resistance to slow them down
      render: {
        fillStyle: color,
        strokeStyle: 'rgba(0,0,0,0.2)',
        lineWidth: 2
      }
    })
    
    capsules.push(circle)
  }

  Matter.Composite.add(engine.world, capsules)
}

const spin = () => {
  if (isSpinning.value || props.restaurants.length === 0) return
  
  isSpinning.value = true
  showResult.value = false
  result.value = null

  // Apply single kick (impulse) with random delays
  capsules.forEach(body => {
    const delay = Math.random() * 50 // Reduced delay for tighter kick synchronization
    
    setTimeout(() => {
      const angle = -Math.random() * Math.PI // Random angle in upper hemisphere (0 to -PI)
      const force = Math.random() * 0.1 + 0.05 // Reduced random force magnitude (was 0.15 + 0.1)
      
      Matter.Body.applyForce(body, body.position, {
        x: Math.cos(angle) * force,
        y: Math.sin(angle) * force
      })
      // Add some spin
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.5)
    }, delay)
  })

  // Stop spinning and dispense quickly
  setTimeout(() => {
    dispenseCapsule()
  }, 1000) // Slightly increased to account for delays
}

const dispenseCapsule = () => {
  // Select winner logic
  const selected = pickWeighted(props.restaurants)
  result.value = selected

  // Just show result overlay directly without physically dispensing a ball
  isSpinning.value = false
  showResult.value = true
}

// Removed addNewBall as it's no longer needed

const closeResult = () => {
  showResult.value = false
  result.value = null
}

onMounted(() => {
  initPhysics()
})

onUnmounted(() => {
  if (runner) Matter.Runner.stop(runner)
  if (render) Matter.Render.stop(render)
  if (engine) Matter.Engine.clear(engine)
})

watch(() => props.restaurants, () => {
  createCapsules()
}, { deep: true })

</script>

<template>
  <div class="gachapon-container">
    <div class="machine-visual">
      <div class="dome-glass"></div>
      <div ref="containerRef" class="physics-container">
        <canvas ref="canvasRef"></canvas>
      </div>
      
      <div class="machine-body">
        <div class="controls">
          <button 
            class="spin-btn" 
            @click="spin" 
            :disabled="isSpinning || restaurants.length === 0"
            :class="{ spinning: isSpinning }"
          >
            {{ isSpinning ? 'SPINNING...' : 'SPIN' }}
          </button>
        </div>
        <div class="chute-opening"></div>
      </div>
    </div>

    <div v-if="showResult" class="result-overlay" @click="closeResult">
      <div class="result-capsule open">
        <div class="result-content">
          <h3>Winner!</h3>
          <div class="winner-name">{{ result?.name }}</div>
          <p class="click-hint">Click to close</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gachapon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
}

.machine-visual {
  position: relative;
  width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dome-glass {
  position: absolute;
  top: 0;
  left: 10px;
  width: 300px;
  height: 300px;
  border-radius: 50% 50% 0 0;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), rgba(255,255,255,0.1) 60%, rgba(255,255,255,0));
  border: 4px solid rgba(255,255,255,0.3);
  border-bottom: none;
  pointer-events: none;
  z-index: 10;
  box-shadow: inset 0 0 20px rgba(255,255,255,0.2);
}

.physics-container {
  width: 300px;
  height: 400px; /* Taller to include chute area */
  background: rgba(0,0,0,0.2);
  border-radius: 150px 150px 0 0;
  overflow: hidden;
}

.machine-body {
  width: 320px;
  height: 150px;
  background: #ff6b6b;
  margin-top: -100px; /* Overlap with physics container */
  border-radius: 20px;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 10px 20px rgba(0,0,0,0.3);
  border: 4px solid rgba(255,255,255,0.2);
}

.controls {
  margin-bottom: 10px;
}

.spin-btn {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: none;
  background: #feca57;
  box-shadow: 0 5px 0 #e1b12c;
  font-weight: bold;
  color: #5f27cd;
  cursor: pointer;
  transition: transform 0.1s;
  z-index: 20;
  position: relative;
}

.spin-btn:active:not(:disabled) {
  transform: translateY(5px);
  box-shadow: 0 0 0 #e1b12c;
}

.spin-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spin-btn.spinning {
  animation: spin 1s infinite linear;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.chute-opening {
  width: 80px;
  height: 40px;
  background: #333;
  border-radius: 0 0 20px 20px;
  position: absolute;
  bottom: 10px;
}

/* Result Overlay */
.result-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  animation: fadeIn 0.3s;
}

.result-capsule {
  width: 300px;
  height: 300px;
  background: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
  box-shadow: 0 0 50px rgba(255, 255, 255, 0.5);
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  color: #333;
}

.result-content h3 {
  margin: 0;
  color: #888;
  font-size: 1.2rem;
}

.winner-name {
  font-size: 2.5rem;
  font-weight: 900;
  color: #ff6b6b;
  margin: 20px 0;
  word-break: break-word;
}

.click-hint {
  font-size: 0.8rem;
  color: #aaa;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes popIn {
  from { transform: scale(0); }
  to { transform: scale(1); }
}
</style>
