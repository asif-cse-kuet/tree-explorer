
<script setup>
import { onMounted } from 'vue';
onMounted(() => {});
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full lg:w-auto">
    <slot></slot>
  </div>
</template>

<style lang="css" scoped>
</style>