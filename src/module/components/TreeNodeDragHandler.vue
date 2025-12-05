<script setup>
import { ref, computed } from 'vue';
import { useTreeStore } from '../../stores';

const props = defineProps({
  nodeKey: String,
  nodeValue: [Object, String, Number, Boolean],
  path: String,
  level: Number,
  isSelected: Boolean,
  isFirstChildOfParent: Boolean
});

const treeStore = useTreeStore();
const isDragging = ref(false);
const isDragOver = ref(false);
const dropPosition = ref(null); // 'before', 'after', or 'inside'
const isParentSiblingDrop = ref(false); // true when dropping between parent and first child

// Check if node value is a container (object), allow empty objects as drop targets
const isContainer = computed(() => {
  return props.nodeValue !== null && typeof props.nodeValue === 'object' && !Array.isArray(props.nodeValue);
});

const isImmediateParentOfDraggedNode = (sourcePath) => {
  if (!sourcePath || !props.path) return false;
  const sourceArray = sourcePath.replace('root.', '').split('.');
  const targetArray = props.path.replace('root.', '').split('.');
  
  // Target is immediate parent if source is one level deeper and shares same parent path
  return sourceArray.length === targetArray.length + 1 &&
    sourceArray.slice(0, -1).join('.') === targetArray.join('.');
};

const startDrag = (e) => {
  isDragging.value = true;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('sourcePath', props.path);
};

const dragEnd = () => {
  isDragging.value = false;
  isDragOver.value = false;
  dropPosition.value = null;
  isParentSiblingDrop.value = false;
};

const dragOver = (e) => {
  const sourcePath = e.dataTransfer.getData('sourcePath');
  
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  
  // Detect drop position based on mouse location
  const rect = e.currentTarget.getBoundingClientRect();
  const relativeY = e.clientY - rect.top;
  const height = rect.height;
  const percentY = relativeY / height;
  
  // Define zones: always offer inside; containers and leaves share the same split
  if (percentY < 0.3) {
    dropPosition.value = 'before';
  } else if (percentY > 0.7) {
    dropPosition.value = 'after';
  } else {
    dropPosition.value = 'inside';
  }
  
  // Block sibling drops on root level (level 0)
  if (props.level === 0 && (dropPosition.value === 'before' || dropPosition.value === 'after')) {
    dropPosition.value = null;
    isDragOver.value = false;
    isParentSiblingDrop.value = false;
    e.dataTransfer.dropEffect = 'none';
    return;
  }
  
  // Detect if this is a parent-first-child boundary drop (before first child = sibling of parent)
  isParentSiblingDrop.value = props.isFirstChildOfParent && dropPosition.value === 'before';
  
  // Block inside drop only if trying to drop parent inside immediate child
  if (dropPosition.value === 'inside' && isContainer.value && isImmediateParentOfDraggedNode(sourcePath)) {
    dropPosition.value = null;
    isDragOver.value = false;
    isParentSiblingDrop.value = false;
    e.dataTransfer.dropEffect = 'none';
    return;
  }
  
  isDragOver.value = true;
};

const dragLeave = () => {
  isDragOver.value = false;
};

const drop = (e) => {
  e.preventDefault();
  e.stopPropagation();
  const currentDropPosition = dropPosition.value;
  isDragOver.value = false;

  const sourcePath = e.dataTransfer.getData('sourcePath');
  
  // Don't drop on same node
  if (!sourcePath || sourcePath === props.path) return;
  
  // Parse paths and move node
  const sourceArray = sourcePath.replace('root.', '').split('.');
  const targetArray = props.path.replace('root.', '').split('.');
  
  treeStore.moveNode(sourceArray, targetArray, currentDropPosition);
};

defineExpose({
  isDragging,
  isDragOver
});
</script>

<template>
  <div
    draggable="true"
    @dragstart="startDrag"
    @dragend="dragEnd"
    @dragover="dragOver"
    @dragleave="dragLeave"
    @drop="drop"
    :class="{ 
      'drag-over-before': isDragOver && dropPosition === 'before' && !isParentSiblingDrop,
      'drag-over-before-parent': isDragOver && dropPosition === 'before' && isParentSiblingDrop,
      'drag-over-after': isDragOver && dropPosition === 'after',
      'drag-over-inside': isDragOver && dropPosition === 'inside',
      'dragging': isDragging 
    }"
    class="draggable-node"
  >
    <div v-if="isDragOver && dropPosition" class="drag-hint">
      {{ dropPosition === 'inside' ? 'Add as child' : 'Add as sibling' }}
    </div>
    <slot :isDragging="isDragging" :dragOver="isDragOver"></slot>
  </div>
</template>

<style scoped>
.draggable-node {
  position: relative;
  transition: all 0.2s ease;
}

.draggable-node.dragging {
  opacity: 0.5;
}

.draggable-node.drag-over-before::before {
  content: '';
  position: absolute;
  top: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #3b82f6;
  z-index: 10;
}

.draggable-node.drag-over-before-parent::before {
  content: '';
  position: absolute;
  top: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #f97316;
  z-index: 10;
}

.draggable-node.drag-over-after::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #3b82f6;
  z-index: 10;
}

.draggable-node.drag-over-inside {
  background-color: #dcfce7;
  border-radius: 4px;
  outline: 2px dashed #22c55e;
  outline-offset: -2px;
}

.drag-hint {
  position: absolute;
  top: -18px;
  right: 6px;
  padding: 2px 6px;
  font-size: 12px;
  background: #111827;
  color: #f9fafb;
  border-radius: 4px;
  z-index: 20;
  pointer-events: none;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}
</style>
