
<script setup>
import { useTreeStore } from '../../stores';
import TreeNode from './TreeNode.vue';

const treeStore = useTreeStore();
</script>

<template>
  <div>
    <slot></slot>
    <div class="bg-white border border-gray-300 rounded p-4 flex flex-col h-110 w-full sm:w-96 lg:w-96">
      <div class="flex-1 overflow-y-auto p-3 font-mono text-normal text-gray-800 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        <div class="tree">
          <!-- Render tree recursively -->
          <div v-for="(value, key) in treeStore.jsonData" :key="key" class="tree__root">
            <TreeNode :nodeKey="String(key)" :nodeValue="value" :path="`root.${key}`" :level="0" />
          </div>
        </div>
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

