<script setup>
import { ref, onMounted } from 'vue';

const connectionStage = ref(0);
const connectionMessages = [
  'CONNECTING...',
  'NEGOTIATING...',
  'HANDSHAKING...',
  'AUTHENTICATING...',
  'CONNECTED!',
];

onMounted(() => {
  const connectionInterval = setInterval(() => {
    if (connectionStage.value < connectionMessages.length - 1) {
      connectionStage.value++;
    }
  }, 1000);

  return () => clearInterval(connectionInterval);
});
</script>

<template>
  <div class="modem-loading">
    <pre>{{ connectionMessages[connectionStage.value] }}</pre>
  </div>
</template>

<style scoped>
.modem-loading {
  /* Add styles for the modem loading animation here */
}
</style>