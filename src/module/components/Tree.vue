
<script setup>
import { onMounted } from 'vue';
onMounted(() => {});
</script>

<template>
  <div>
    <slot></slot>
    <div class="bg-white border border-gray-300 rounded p-4 flex flex-col h-96 w-full sm:w-96 lg:w-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
      This is tree
    </div>
  </div>
</template>

<style scoped>
/* Fallback scrollbar for non-webkit browsers */
div::-webkit-scrollbar {
  width: 6px;
}

div::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

div::-webkit-scrollbar-thumb {
  background: #9ca3af;
  border-radius: 3px;
}

div::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>

