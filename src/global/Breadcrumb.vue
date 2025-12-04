
<script setup>
import { onMounted } from 'vue';

const props = defineProps({
  path: {
    type: Array,
    default: () => []
  }
});

onMounted(() => {});
</script>

<template>
  <div class="flex items-center gap-2 text-sm">
    <template v-for="(item, index) in path" :key="index">
      <span 
        class="px-2 py-1 rounded text-black font-semibold hover:bg-gray-300 cursor-pointer text-xl transition-colors"
      >
        {{ item }}
      </span>
      <svg 
        v-if="index < path.length - 1"
        viewBox="0 0 24 24" 
        fill="none"
        stroke="currentColor" 
        stroke-width="4"
        class="w-3 h-3"
      >
        <path  
          stroke-linecap="round" 
          stroke-linejoin="round" 
          d="m8.25 4.5 7.5 7.5-7.5 7.5"
        />
      </svg>
    </template>
    <span v-if="!path || path.length === 0" class="text-gray-400 italic">No path selected</span>
  </div>
</template>

<style lang="css" scoped>
</style>

