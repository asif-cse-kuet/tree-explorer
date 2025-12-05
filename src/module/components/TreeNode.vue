<script setup>
import { ref, computed, nextTick, inject } from 'vue';
import { useTreeStore } from '../../stores';

const treeStore = useTreeStore();
const handleTreeDelete = inject('handleTreeDelete');

const props = defineProps({
  nodeKey: {
    type: String,
    required: true
  },
  nodeValue: {
    type: [Object, String, Number, Boolean],
    required: true
  },
  path: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['tree-delete-request']);

const isExpanded = ref(true);
const isEditing = ref(false);
const editingName = ref('');
const editInput = ref(null);

// Convert path string to array for comparison
const pathArray = computed(() => {
  return props.path.replace('root.', '').split('.');
});

const isSelected = computed(() => {
  const selected = treeStore.selectedPath;
  const current = pathArray.value;
  return JSON.stringify(selected) === JSON.stringify(current);
});

const toggleNode = (e) => {
  if (hasChildren(props.nodeValue)) {
    e.stopPropagation();
    isExpanded.value = !isExpanded.value;
  }
};

const selectNode = () => {
  treeStore.setSelectedPath(pathArray.value);
};

const startEditing = async (e) => {
  e.stopPropagation();
  isEditing.value = true;
  editingName.value = props.nodeKey;
  await nextTick();
  editInput.value?.focus();
  editInput.value?.select();
};

const finishEditing = () => {
  if (editingName.value.trim() && editingName.value !== props.nodeKey) {
    treeStore.renameNode(pathArray.value, editingName.value);
  }
  isEditing.value = false;
};

const cancelEditing = (e) => {
  if (e.key === 'Escape') {
    isEditing.value = false;
  } else if (e.key === 'Enter') {
    finishEditing();
  }
};

const deleteNodeHandler = (e) => {
  e.stopPropagation();
  if (props.level > 0 && handleTreeDelete) {
    handleTreeDelete({
      nodeKey: props.nodeKey,
      path: pathArray.value
    });
  }
};

const isObject = (value) => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

const hasChildren = (value) => {
  return isObject(value) && Object.keys(value).length > 0;
};
</script>

<template>
  <div class="tree__node" :class="{ 'tree__node--root': level === 0 }" :style="{ paddingLeft: level > 0 ? '35px' : '0' }">
    <div 
      class="node-header group" 
      :class="{ 'node-header--selected': isSelected }"
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
      
      <!-- Node label - Editable -->
      <input 
        v-if="isEditing"
        v-model="editingName"
        @blur="finishEditing"
        @keydown="cancelEditing"
        @click.stop
        class="node-input"
        ref="editInput"
      />
      <span 
        v-else
        class="node-label" 
        :class="{ 'cursor-pointer': hasChildren(nodeValue) }"
        @dblclick="startEditing"
      >
        {{ nodeKey }}
      </span>

      <!-- Delete button - only for non-root nodes -->
      <button
        v-if="level > 0"
        @click="deleteNodeHandler"
        class="delete-btn"
        title="Delete node"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <circle cx="12" cy="12" r="10" />
          <line x1="8" y1="12" x2="16" y2="12" stroke="white" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
    </div>

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

.tree__node--root > .node-header:before {
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

.node-label {
  font-weight: 400;
  flex: 1;
}

.node-label.cursor-pointer {
  cursor: pointer;
}

.node-label:hover {
  color: #1f2937;
}

.node-input {
  flex: 1;
  padding: 2px 4px;
  border: 1px solid #3b82f6;
  border-radius: 3px;
  font-size: 14px;
  font-weight: 400;
  outline: none;
  background: white;
}

.delete-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  margin-left: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #ef4444;
  transition: color 0.2s ease, transform 0.2s ease;
}

.delete-btn:hover {
  color: #dc2626;
  transform: scale(1.1);
}

.tree__children {
  position: relative;
}
</style>
