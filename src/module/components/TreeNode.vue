<script setup>
import { ref, computed } from 'vue';
import { useTreeStore } from '../../stores';
import TreeNodeDragHandler from './TreeNodeDragHandler.vue';
import TreeNodeContent from './TreeNodeContent.vue';

const treeStore = useTreeStore();

const props = defineProps({
  nodeKey: String,
  nodeValue: [Object, String, Number, Boolean],
  path: String,
  level: Number
});

const isExpanded = ref(true);

const pathArray = computed(() => {
  return props.path.replace('root.', '').split('.');
});

const isSelected = computed(() => {
  const selected = treeStore.selectedPath;
  const current = pathArray.value;
  return JSON.stringify(selected) === JSON.stringify(current);
});

const isObject = (value) => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

const hasChildren = (value) => {
  return isObject(value) && Object.keys(value).length > 0;
};

const toggleNode = (e) => {
  if (hasChildren(props.nodeValue)) {
    e.stopPropagation();
    isExpanded.value = !isExpanded.value;
  }
};

const selectNode = () => {
  treeStore.setSelectedPath(pathArray.value);
};
</script>

<template>
  <div class="tree__node" :class="{ 'tree__node--root': level === 0 }" :style="{ paddingLeft: level > 0 ? '35px' : '0' }">
    <TreeNodeDragHandler :nodeKey="nodeKey" :nodeValue="nodeValue" :path="path" :level="level" :isSelected="isSelected">
      <template #default>
        <div 
          class="node-header group" 
          :class="{ 'node-header--selected': isSelected, 'node-header--root': level === 0 }"
          @click="selectNode"
        >
          <!-- Arrow icon for nodes with children -->
          <span v-if="hasChildren(nodeValue)" class="toggle-arrow" @click="toggleNode">
            <svg 
              :class="{ 'rotate-90': isExpanded }"
              class="arrow-icon"
              viewBox="0 0 24 24" 
              fill="none"
              stroke="currentColor" 
              stroke-width="2"
              width="16"
              height="16"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </span>
          <!-- Spacer for leaf nodes -->
          <span v-else class="toggle-spacer"></span>
          
          <!-- Node content (label, edit, delete) -->
          <TreeNodeContent :nodeKey="nodeKey" :nodeValue="nodeValue" :path="path" :level="level" />
        </div>
      </template>
    </TreeNodeDragHandler>

    <!-- Children nodes -->
    <div v-if="hasChildren(nodeValue) && isExpanded" class="tree__children">
      <TreeNode 
        v-for="(childValue, childKey) in nodeValue" 
        :key="`${path}.${childKey}`"
        :nodeKey="String(childKey)" 
        :nodeValue="childValue" 
        :path="`${path}.${childKey}`"
        :level="level + 1"
      />
    </div>
  </div>
</template>

<style scoped>
.tree__node {
  position: relative;
  margin: 2px 0;
}

.node-header {
  display: flex;
  align-items: center;
  position: relative;
  padding: 4px 0;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.node-header:hover {
  background-color: #f3f4f6;
}

.node-header--selected {
  background-color: #dbeafe;
}

.node-header--selected:hover {
  background-color: #bfdbfe;
}

.node-header:before {
  content: "";
  position: absolute;
  top: -3px;
  bottom: 50%;
  width: 25px;
  left: -23px;
  border-left: 2px solid #5d5e5e;
  border-bottom: 2px solid #5d5e5e;
}

.node-header--root:before {
  display: none;
}

.tree__node:after {
  content: "";
  position: absolute;
  top: -3px;
  bottom: 0;
  width: 2px;
  right: auto;
  left: 12px;
  border-left: 2px solid #5d5e5e;
}

.tree__node--root:after {
  display: none;
}

.tree__node:last-child:after {
  display: none;
}

.toggle-arrow {
  display: inline-flex;
  align-items: center;
  margin-right: 6px;
  margin-left: 6px;
  cursor: pointer;
}

.arrow-icon {
  transition: transform 0.2s ease;
}

.arrow-icon.rotate-90 {
  transform: rotate(0deg);
}

.toggle-spacer {
  display: inline-block;
  width: 5px;
  margin-left: 2px;
}

.tree__children {
  position: relative;
}
</style>
