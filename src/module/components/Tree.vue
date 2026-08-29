
<script setup>
import { ref, provide } from 'vue';
import { useTreeStore } from '../../stores';
import TreeJsonInput from './TreeJsonInput.vue';
import DeleteConfirmDialog from '../../global/DeleteConfirmDialog.vue';

const treeStore = useTreeStore();
const jsonInputRef = ref(null);
const deleteDialog = ref(null);

const openJsonInput = () => {
  jsonInputRef.value?.openDialog();
};

const clearData = () => {
  treeStore.clearJsonData();
};

const handleTreeDeleteRequest = (deleteData) => {
  deleteDialog.value?.openDialog(deleteData.nodeKey, (confirmed) => {
    if (confirmed) {
      treeStore.deleteNode(deleteData.path);
    }
  });
};

// Provide the delete handler to child TreeNode components
provide('handleTreeDelete', handleTreeDeleteRequest);
</script>

<template>
  <div>
    <slot name="breadcrumb"></slot>
    <div class="bg-white border border-gray-300 rounded p-4 flex flex-col h-110 w-full sm:w-96 lg:w-[350px] xl:w-[400px]">
      <!-- Show import button when no data -->
      <div v-if="!treeStore.hasData" class="flex-1 flex items-center justify-center">
        <button
          @click="openJsonInput"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Import
        </button>
      </div>
      
      <!-- Show tree when data exists -->
      <div v-else class="flex-1 flex flex-col min-h-0">
        <div class="flex gap-2 mb-3 shrink-0">
          <button
            @click="openJsonInput"
            class="flex-1 px-3 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition-colors text-sm"
          >
            Re-import
          </button>
          <button
            @click="clearData"
            class="flex-1 px-3 py-2 bg-gray-200 text-gray-800 rounded font-semibold hover:bg-gray-300 transition-colors text-sm"
          >
            Clear data
          </button>
        </div>
        <div class="flex-1 overflow-y-auto overflow-x-auto p-3 font-mono text-normal text-gray-800 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <div class="tree">
            <!-- Render tree recursively via slot -->
            <slot name="tree" :jsonData="treeStore.jsonData"></slot>
          </div>
        </div>
      </div>
    </div>
    
    <!-- TreeJsonInput Dialog -->
    <TreeJsonInput ref="jsonInputRef" />
    
    <!-- DeleteConfirmDialog -->
    <DeleteConfirmDialog ref="deleteDialog" />
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
  min-width: fit-content;
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

