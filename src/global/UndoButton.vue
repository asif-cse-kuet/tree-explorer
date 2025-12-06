<script setup>
import { computed } from 'vue';
import { useTreeStore } from '../stores';

const treeStore = useTreeStore();

const canUndo = computed(() => treeStore.canUndo);

const handleUndo = () => {
  if (canUndo.value) {
    treeStore.undoLastAction();
  }
};
</script>

<template>
  <button
    @click="handleUndo"
    :disabled="!canUndo"
    class="undo-btn"
    title="Undo last action"
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      width="18"
      height="18"
    >
      <!-- Curved arrow pointing left for undo -->
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
    </svg>
  </button>
</template>

<style scoped>
.undo-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 8px;
  background: transparent;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
}

.undo-btn:hover:not(:disabled) {
  color: #3b82f6;
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.undo-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  color: #d1d5db;
}
</style>
