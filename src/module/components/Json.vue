
<script setup>
import { computed } from 'vue';
import { useTreeStore } from '../../stores';

const treeStore = useTreeStore();

const breadcrumbPath = computed(() => {
  return treeStore.selectedPath;
});

const formatJson = (obj) => {
  const jsonString = JSON.stringify(obj, null, 2);
  // Remove all double quotes except for empty strings
  let formatted = jsonString.replace(/"([^"]*)"/g, (match, p1) => {
    if (p1 === '') return "''";  // Replace empty strings with single quotes
    return p1;
  });
  
  // Add trailing commas after closing braces and brackets
  formatted = formatted.replace(/(\}|\])(\s*\n\s*[}\],])/g, '$1,$2');
  // Add trailing commas before closing braces/brackets (for last property)
  formatted = formatted.replace(/([^,\s])(\s*\n\s*[}\]])/g, '$1,$2');
  // Remove duplicate commas
  formatted = formatted.replace(/,,/g, ',');
  
  // Remove outer curly braces
  formatted = formatted.replace(/^\{\n/, '');

  // Remove outer curly braces and adjust indentation
  // formatted = formatted.replace(/^\{\n/, '').replace(/\n\}$/, '');
  // Remove 2 spaces from the beginning of each line
  // formatted = formatted.replace(/^  /gm, '');
  
  return formatted;
};
</script>

<template>
  <div class="flex flex-col w-full sm:w-96 lg:w-[450px] xl:w-[450px]">
    <div class="flex flex-wrap ">
      <slot :breadcrumbPath="breadcrumbPath"></slot>
    </div>
    
    <div class="bg-white border border-gray-300 rounded p-4 flex flex-col w-full sm:w-96 lg:w-[450px] xl:w-[450px]">
      <!-- JSON Display with scrollbar -->
      <div class="min-h-[220px] max-h-102 overflow-y-auto p-3 font-mono text-normal text-gray-800 whitespace-pre-wrap wrap-break-words scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        {{ formatJson(treeStore.jsonData) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scrollbar styles for Firefox */
div {
  scrollbar-width: thin;
  scrollbar-color: #9ca3af #f3f4f6;
}

/* Scrollbar styles for WebKit browsers (Chrome, Safari, Edge) */
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

