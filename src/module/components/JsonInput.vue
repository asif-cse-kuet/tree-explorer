<script setup>
import { ref } from 'vue';
import { useTreeStore } from '../../stores';

const treeStore = useTreeStore();
const isOpen = ref(false);
const jsonInput = ref('');

const openDialog = () => {
  isOpen.value = true;
};

const closeDialog = () => {
  isOpen.value = false;
  jsonInput.value = '';
  treeStore.clearError();
};

const handleSubmit = () => {
  treeStore.setJsonData(jsonInput.value);
  
  if (!treeStore.error) {
    closeDialog();
  }
};

const handleKeyDown = (e) => {
  if (e.key === 'Escape') {
    closeDialog();
  }
};

defineExpose({
  openDialog,
});
</script>

<template>
  <!-- Dialog Overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    @click="closeDialog"
  >
    <!-- Dialog Box -->
    <div
      class="bg-white rounded-lg shadow-lg max-w-2xl w-96 p-6 max-h-96 flex flex-col"
      @click.stop
      @keydown="handleKeyDown"
    >
      <!-- Header -->
      <div class="flex justify-between items-center mb-4 border-b pb-3">
        <h2 class="text-xl font-bold text-gray-800">Input JSON</h2>
        <button
          @click="closeDialog"
          class="text-gray-500 hover:text-gray-700 text-2xl font-light leading-none transition-colors"
        >
          ×
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <textarea
          v-model="jsonInput"
          placeholder="Paste your JSON object or array here..."
          class="w-full h-40 p-3 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          @keydown="handleKeyDown"
        ></textarea>

        <!-- Error Warning -->
        <div
          v-if="treeStore.error"
          class="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
        >
          <p class="font-semibold text-sm">⚠️ Warning</p>
          <p class="text-sm">{{ treeStore.error }}</p>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="flex gap-3 justify-end border-t pt-3">
        <button
          @click="closeDialog"
          class="px-4 py-2 bg-gray-300 text-gray-800 rounded font-semibold hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="handleSubmit"
          :disabled="treeStore.isLoading"
          class="px-2 py-1 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {{ treeStore.isLoading ? 'Processing...' : 'Load JSON' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
