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
