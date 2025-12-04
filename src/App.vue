<template>
 <div class="min-h-screen bg-gray-100 p-8">
    <h1 class="text-4xl font-bold text-blue-600 mb-4">Tailwind CSS Test</h1>
    <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
      <p class="text-gray-700">If you can see this styled card with colors and shadows, Tailwind CSS is working! ✅</p>
    </div>
    <IndexPage />
 </div>
</template>

<script setup>
import { ref, computed } from "vue";
import IndexPage from "./module/pages/IndexPage.vue";
</script>
