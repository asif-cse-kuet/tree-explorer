
<script setup>
import { ref } from 'vue';
import { useTreeStore } from '../../stores';
import TreeJsonInput from './TreeJsonInput.vue';

const treeStore = useTreeStore();
const jsonInputRef = ref(null);

const openJsonInput = () => {
  jsonInputRef.value?.openDialog();
};
</script>

<template>
  <div>
    <slot name="breadcrumb"></slot>
    <div class="bg-white border border-gray-300 rounded p-4 flex flex-col h-110 w-full sm:w-96 lg:w-[280px] xl:w-[400px]">
      <!-- Show import button when no data -->
      <div v-if="!treeStore.hasData" class="flex-1 flex items-center justify-center">
        <button
          @click="openJsonInput"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Import JSON
        </button>
      </div>
      
      <!-- Show tree when data exists -->
      <div v-else class="flex-1 overflow-y-auto p-3 font-mono text-normal text-gray-800 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        <div class="tree">
          <!-- Render tree recursively via slot -->
          <slot name="tree" :jsonData="treeStore.jsonData"></slot>
        </div>
      </div>
    </div>
    
    <!-- TreeJsonInput Dialog -->
    <TreeJsonInput ref="jsonInputRef" />
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

/* Tree styles */
.tree {
  user-select: none;
}

.tree__root {
  margin-bottom: 4px;
}

.tree__root > :deep(.tree__node > .node-header:before) {
  display: none;
}

.tree__root > :deep(.tree__node:after) {
  display: none;
}
</style>

