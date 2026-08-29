
<script setup>
import { computed } from 'vue';
import { useTreeStore } from '../../stores';

const treeStore = useTreeStore();

const breadcrumbPath = computed(() => {
  return treeStore.selectedPath;
});

const formattedJson = computed(() => {
  if (!treeStore.jsonData) return '';
  return JSON.stringify(treeStore.jsonData, null, 2);
});
</script>

<template>
  <div class="flex flex-col w-full sm:w-96 lg:w-[450px] xl:w-[450px]">
    <div class="flex flex-wrap ">
      <slot :breadcrumbPath="breadcrumbPath"></slot>
    </div>
    
    <div class="bg-white border border-gray-300 rounded p-4 flex flex-col w-full sm:w-96 lg:w-[450px] xl:w-[450px]">
      <div class="min-h-[220px] max-h-102 overflow-y-auto p-3 font-mono text-normal text-gray-800 whitespace-pre-wrap wrap-break-words scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        {{ formattedJson }}
      </div>
    </div>
  </div>
</template>

<style scoped>
div {
  scrollbar-width: thin;
  scrollbar-color: #9ca3af #f3f4f6;
}

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
