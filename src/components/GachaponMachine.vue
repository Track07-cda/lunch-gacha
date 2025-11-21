<script setup>
import { ref } from 'vue'
import { pickWeighted } from '../utils/random'

const props = defineProps({
  restaurants: {
    type: Array,
    required: true
  }
})

const isSpinning = ref(false)
const result = ref(null)
const showResult = ref(false)

const spin = () => {
  if (isSpinning.value || props.restaurants.length === 0) return
  
  isSpinning.value = true
  showResult.value = false
  result.value = null

  // Animation timing
  setTimeout(() => {
    const selected = pickWeighted(props.restaurants)
    result.value = selected
    
    // Stop spinning, show capsule falling
    setTimeout(() => {
      isSpinning.value = false
      showResult.value = true
    }, 1000)
  }, 1500)
}

const closeResult = () => {
  showResult.value = false
  result.value = null
}
</script>

<template>
  <div class="gachapon-container">
    <div class="machine" :class="{ shaking: isSpinning }">
      <div class="dome">
        <div class="capsules">
          <!-- Decorative capsules inside -->
          <div class="capsule c1"></div>
          <div class="capsule c2"></div>
          <div class="capsule c3"></div>
          <div class="capsule c4"></div>
        </div>
      </div>
      <div class="body">
        <div class="knob-area">
          <button 
            class="knob" 
            @click="spin" 
            :disabled="isSpinning || restaurants.length === 0"
            :class="{ spinning: isSpinning }"
          >
            PRESS
          </button>
        </div>
        <div class="chute">
          <div class="hole"></div>
        </div>
      </div>
    </div>

    <div v-if="showResult" class="result-overlay" @click="closeResult">
      <div class="result-capsule open">
        <div class="result-content">
          <h3>Let's eat at:</h3>
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

.machine {
  width: 300px;
  height: 500px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dome {
  width: 240px;
  height: 240px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50% 50% 0 0;
  border: 4px solid rgba(255, 255, 255, 0.5);
  border-bottom: none;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(2px);
  z-index: 10;
}

.capsules {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.capsule {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: absolute;
  border: 2px solid rgba(0,0,0,0.1);
}

.c1 { background: #ff6b6b; top: 60%; left: 20%; transform: rotate(15deg); }
.c2 { background: #4ecdc4; top: 70%; left: 50%; transform: rotate(-10deg); }
.c3 { background: #ffe66d; top: 50%; left: 60%; transform: rotate(45deg); }
.c4 { background: #ff9f43; top: 80%; left: 30%; transform: rotate(90deg); }

.body {
  width: 260px;
  height: 260px;
  background: #ff6b6b;
  border-radius: 20px;
  border: 4px solid rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  z-index: 20;
  margin-top: -10px;
}

.knob-area {
  background: rgba(0,0,0,0.1);
  border-radius: 50%;
  padding: 10px;
}

.knob {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: none;
  background: #feca57;
  box-shadow: 0 5px 0 #e1b12c;
  cursor: pointer;
  font-weight: bold;
  color: #5f27cd;
  font-size: 1.2rem;
  transition: transform 0.1s;
}

.knob:active {
  transform: translateY(5px);
  box-shadow: 0 0 0 #e1b12c;
}

.knob:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.chute {
  width: 100px;
  height: 60px;
  background: #333;
  border-radius: 10px 10px 40px 40px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 10px;
}

.hole {
  width: 60px;
  height: 20px;
  background: #000;
  border-radius: 10px;
}

/* Animations */
.shaking .dome .capsules {
  animation: shake 0.5s infinite;
}

.knob.spinning {
  animation: spin 1s infinite linear;
}

@keyframes shake {
  0% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(5px, 5px) rotate(5deg); }
  50% { transform: translate(0, -5px) rotate(0deg); }
  75% { transform: translate(-5px, 5px) rotate(-5deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
