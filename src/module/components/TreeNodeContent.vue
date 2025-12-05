<script setup>
import { ref, computed, nextTick, inject } from 'vue';
import { useTreeStore } from '../../stores';

const props = defineProps({
  nodeKey: String,
  nodeValue: [Object, String, Number, Boolean],
  path: String,
  level: Number
});

const treeStore = useTreeStore();
const handleTreeDelete = inject('handleTreeDelete');

const isEditing = ref(false);
const editingName = ref('');
const editInput = ref(null);
const isAddingSibling = ref(false);
const addingSiblingName = ref('');
const addSiblingInput = ref(null);

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
    const pathArray = props.path.replace('root.', '').split('.');
    treeStore.renameNode(pathArray, editingName.value);
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
    const pathArray = props.path.replace('root.', '').split('.');
    handleTreeDelete({
      nodeKey: props.nodeKey,
      path: pathArray
    });
  }
};

const startAddingSibling = async (e) => {
  e.stopPropagation();
  isAddingSibling.value = true;
  addingSiblingName.value = '';
  await nextTick();
  addSiblingInput.value?.focus();
};

const finishAddingSibling = () => {
  if (addingSiblingName.value.trim()) {
    const pathArray = props.path.replace('root.', '').split('.');
    treeStore.addSiblingNode(pathArray, addingSiblingName.value);
  }
  isAddingSibling.value = false;
  addingSiblingName.value = '';
};

const cancelAddingSibling = (e) => {
  if (e.key === 'Escape') {
    isAddingSibling.value = false;
    addingSiblingName.value = '';
  } else if (e.key === 'Enter') {
    finishAddingSibling();
  }
};
</script>

<template>
  <div class="node-content">
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
      @dblclick="startEditing"
      title="Double click to edit"
    >
      {{ nodeKey }}
    </span>

    <!-- Add sibling button - blue + without rounded border -->
    <div class="add-sibling-container">
      <button
        @click="startAddingSibling"
        class="add-sibling-btn"
        title="Add sibling node after this one"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <line x1="12" y1="5" x2="12" y2="19" stroke-linecap="round" />
          <line x1="5" y1="12" x2="19" y2="12" stroke-linecap="round" />
        </svg>
      </button>

      <!-- Floating input for add sibling -->
      <div v-if="isAddingSibling" class="floating-input-wrapper">
        <input
          v-model="addingSiblingName"
          @blur="finishAddingSibling"
          @keydown="cancelAddingSibling"
          @click.stop
          class="floating-input"
          placeholder="New sibling key"
          ref="addSiblingInput"
        />
      </div>
    </div>

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
</template>

<style scoped>
.node-content {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.node-label {
  font-weight: 400;
  flex: 1;
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

.add-sibling-container {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.add-sibling-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  margin-left: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #3b82f6;
  transition: color 0.2s ease, transform 0.2s ease;
}

.add-sibling-btn:hover {
  color: #2563eb;
  transform: scale(1.15);
}

.floating-input-wrapper {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  z-index: 1000;
  background: white;
  border: 1px solid #3b82f6;
  border-radius: 3px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.floating-input {
  padding: 4px 8px;
  border: none;
  font-size: 14px;
  font-weight: 400;
  outline: none;
  background: transparent;
  min-width: 150px;
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
</style>
