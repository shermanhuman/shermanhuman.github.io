<script setup>
import { ref, onMounted } from 'vue';

const loadingChars = ref(['|', '/', '-', '\\']);
const currentLoadingChar = ref(0);
const loadingMessage = ref('LOADING ');

onMounted(() => {
  const loadingInterval = setInterval(() => {
    currentLoadingChar.value = (currentLoadingChar.value + 1) % loadingChars.value.length;
    loadingMessage.value = `LOADING ${loadingChars.value[currentLoadingChar.value]}`;
  }, 100);

  return () => clearInterval(loadingInterval);
});
</script>

<template>
  <div class="disk-loading">
    <pre>{{ loadingMessage }}</pre>
  </div>
</template>

<style scoped>
.disk-loading {
  /* Add styles for the disk loading animation here */
}
</style>