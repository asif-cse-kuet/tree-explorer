<script setup>
import { ref } from 'vue';

const isOpen = ref(false);
const nodeKeyToDelete = ref('');
let resolveCallback = null;

const props = defineProps({
  nodeKey: {
    type: String,
    default: ''
  }
});

const openDialog = (nodeKey, callback) => {
  nodeKeyToDelete.value = nodeKey;
  resolveCallback = callback;
  isOpen.value = true;
};

const confirmDelete = () => {
  isOpen.value = false;
  if (resolveCallback) {
    resolveCallback(true);
    resolveCallback = null;
  }
};

const cancelDelete = () => {
  isOpen.value = false;
  if (resolveCallback) {
    resolveCallback(false);
    resolveCallback = null;
  }
};

defineExpose({
  openDialog
});
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50" style="background-color: rgba(0, 0, 0, 0.5);">
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
      <h2 class="text-lg font-bold text-gray-900 mb-4">Delete Confirmation</h2>
      <p class="text-gray-700 mb-6">
        Are you sure you want to delete <span class="font-semibold">"{{ nodeKeyToDelete }}"</span>?
      </p>
      <div class="flex gap-3 justify-end">
        <button
          @click="cancelDelete"
          class="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="confirmDelete"
          class="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
