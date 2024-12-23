<script setup>
import { ref, computed, onMounted, onUnmounted, toRefs } from 'vue'

const props = defineProps({
  asciiArt: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: '',
  },
  animate: {
    type: Boolean,
    default: false,
  },
})

// Destructure them as refs so we can use `asciiArt.value` in JS code.
// But in the template, Vue will unwrap them automatically if you do `asciiArt`.
const { asciiArt, title, animate } = toRefs(props)

// We'll keep a dummy ref to force updates so the color animation re-computes.
const forceUpdate = ref(0)

// Precompute a rainbow gradient
const gradientSteps = 6
const baseColors = [
  [255, 0, 0],     // Red
  [255, 165, 0],   // Orange
  [255, 255, 0],   // Yellow
  [0, 255, 0],     // Green
  [0, 0, 255],     // Blue
  [75, 0, 130],    // Indigo
  [238, 130, 238], // Violet
]

const colorGradients = computed(() => {
  const gradient = []
  for (let i = 0; i < baseColors.length - 1; i++) {
    for (let j = 0; j < gradientSteps; j++) {
      const r = Math.floor(
        baseColors[i][0] +
          (baseColors[i + 1][0] - baseColors[i][0]) * (j / gradientSteps),
      )
      const g = Math.floor(
        baseColors[i][1] +
          (baseColors[i + 1][1] - baseColors[i][1]) * (j / gradientSteps),
      )
      const b = Math.floor(
        baseColors[i][2] +
          (baseColors[i + 1][2] - baseColors[i][2]) * (j / gradientSteps),
      )
      gradient.push(`rgb(${r},${g},${b})`)
    }
  }
  return gradient
})

const computedGradients = computed(() => {
  // Force this computed to re-run on setInterval
  forceUpdate.value

  // If not animating, return an array of empty strings
  if (!animate.value) {
    return asciiArt.value.map(() => '')
  }

  // Otherwise, pick a color for each line
  const step = Math.floor(Date.now() / 50) % colorGradients.value.length
  return asciiArt.value.map((_, idx) => {
    return colorGradients.value[(idx + step) % colorGradients.value.length]
  })
})

let intervalId = null

onMounted(() => {
  if (animate.value) {
    intervalId = setInterval(() => {
      // increment ref to trigger reactivity
      forceUpdate.value++
    }, 100)
  }
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<template>
  <div v-if="asciiArt.length" class="ascii-art-title">
    <pre v-for="(line, index) in asciiArt" 
         :key="index"
         :style="{ color: computedGradients[index], whiteSpace: 'pre' }"
    >{{ line }}</pre>
  </div>
  <h1 v-else>{{ title }}</h1>
</template>

<style scoped>
.ascii-art-title {
  width: fit-content;
  overflow: hidden;
  text-align: center;
  position: relative;
  animation: moveAscii 2s linear infinite alternate, shimmer 3s linear infinite alternate;
}

@keyframes moveAscii {
  from {
    transform: translateX(-1%);
  }
  to {
    transform: translateX(72%);
  }
}

@keyframes shimmer {
  0% {
    opacity: 0.85;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.85;
  }
}

.ascii-art-title pre {
  font-size: 24px;
  line-height: 1.2em;
  margin: 0;
  padding: 0;
  display: block;
}
</style>
