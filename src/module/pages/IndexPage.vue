
<script setup lang="ts">
import { onMounted } from 'vue';
import Layout from '../components/Layout.vue';
import Breadcrumb from '../../global/Breadcrumb.vue';
import Json from '../components/Json.vue';
import Tree from '../components/Tree.vue';

onMounted(() => {});
</script>

<template>
  <div>
    <Layout>
      <Breadcrumb />
      <Tree />
      <Json />
    </Layout>
  </div>
</template>

<style lang="css" scoped>
</style>
