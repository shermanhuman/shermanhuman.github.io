<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  menuItems: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['loadResume', 'loadBlogList', 'loadHyperlinks']);

const selectedMenuItem = ref(0);

const handleKeydown = (event) => {
  if (event.key === 'ArrowUp') {
    selectedMenuItem.value = (selectedMenuItem.value - 1 + props.menuItems.length) % props.menuItems.length;
  } else if (event.key === 'ArrowDown') {
    selectedMenuItem.value = (selectedMenuItem.value + 1) % props.menuItems.length;
  } else if (event.key === 'Enter') {
    const selectedAction = props.menuItems[selectedMenuItem.value].action;
    emit(selectedAction);
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div id="main-menu">
    <h1>MAIN MENU</h1>
    <ul>
      <li
        v-for="(item, index) in props.menuItems"
        :key="index"
        :class="{ selected: index === selectedMenuItem }"
        @click="emit(item.action)"
      >
        {{ index + 1 }}. {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* You can add specific styles for the menu here if needed */
</style>