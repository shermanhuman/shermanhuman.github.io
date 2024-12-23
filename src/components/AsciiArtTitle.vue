<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  asciiArt: {
    type: Array,
    default: null,
  },
  title: {
    type: String,
    default: '',
  },
  animate: {
      type: Boolean,
      default: false
  }
});
const position = ref(0);
const direction = ref(1); // 1 for right, -1 for left
const colorIndices = ref([5, 4, 3, 2, 1, 0]);
const currentGradient = ref(0);

const colorGradients = [
    ['#FF0000', '#FF3333', '#FF6666', '#FF9999', '#FFCCCC', '#FFEEEE'], // Red gradient
    ['#00FF00', '#33FF33', '#66FF66', '#99FF99', '#CCFFCC', '#EEFFEE'], // Green gradient
    ['#0000FF', '#3333FF', '#6666FF', '#9999FF', '#CCCCFF', '#EEEEFF']  // Blue gradient
];

const animateAscii = () => {
    if (!props.animate) return;

    position.value += direction.value;

    if (position.value >= 100 || position.value <= -100) {
        direction.value *= -1;
    }

    if (position.value % 10 === 0) {
        for (let i = 0; i < colorIndices.value.length; i++) {
            colorIndices.value[i] = (colorIndices.value[i] + 1) % 6;
        }

        if (colorIndices.value[0] === 5) {
            currentGradient.value = (currentGradient.value + 1) % colorGradients.length;
        }
    }
};

onMounted(() => {
    if (props.animate) {
        setInterval(animateAscii, 50);
    }
});
</script>

<template>
  <div v-if="asciiArt" class="ascii-art-title" :style="props.animate ? { transform: `translateX(${position}%)`, transition: 'transform 0.05s linear' } : {}">
    <pre v-for="(line, index) in asciiArt" :key="index" :style="{ color: props.animate ? colorGradients[currentGradient][colorIndices[index]] : '' }">{{ line }}</pre>
  </div>
  <h1 v-else>{{ title }}</h1>
</template>

<style scoped>
/* You can add specific styles for the ASCII art title here */
</style>