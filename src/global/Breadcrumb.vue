
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
  <div class="h-20 flex flex-wrap content-end gap-1 text-sm">
    <template v-for="(item, index) in path" :key="index">
      <span 
        class="px-1 py-1 rounded text-black font-semibold hover:bg-gray-300 cursor-pointer text-xl transition-colors whitespace-nowrap"
      >
        {{ item }}
      </span>
      <svg 
        v-if="index < path.length - 1"
        viewBox="0 -4 24 24" 
        fill="none"
        stroke="currentColor" 
        stroke-width="4"
        class="w-4"
      >
        <path  
          stroke-linecap="round" 
          stroke-linejoin="round" 
          d="m8.25 4.5 7.5 7.5-7.5 7.5"
        />
      </svg>
    </template>
    <span v-if="!path || path.length === 0" class="px-2 py-1 rounded text-gray-400 font-semibold text-xl whitespace-nowrap">No path selected</span>
  </div>
</template>

<style lang="css" scoped>
</style>

