
<script setup>
import { ref } from 'vue';
import { useTreeStore } from '../../stores';
import JsonInput from './JsonInput.vue';

const treeStore = useTreeStore();
const jsonInputRef = ref(null);

const openJsonInput = () => {
  jsonInputRef.value?.openDialog();
};

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
  <div>
    <slot></slot>
    <div class="bg-white border border-gray-300 rounded p-4 flex flex-col h-110 w-full sm:w-96 lg:w-96">
      <!-- Header with button -->
      <div class="flex justify-end items-center mb-0">
        <button
          @click="openJsonInput"
          class="p-1 bg-gray-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          title="Add JSON"
        >
          <svg fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>

      <!-- JSON Display with scrollbar -->
      <div class="flex-1 overflow-y-auto p-3 font-mono text-normal text-gray-800 whitespace-pre-wrap wrap-break-words scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        {{ formatJson(treeStore.jsonData) }}
      </div>
    </div>

    <!-- JsonInput Dialog -->
    <JsonInput ref="jsonInputRef" />
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

