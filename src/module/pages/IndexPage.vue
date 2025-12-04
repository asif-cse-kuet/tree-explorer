
<script setup>
import { onMounted } from 'vue';
import Layout from '../components/Layout.vue';
import Breadcrumb from '../../global/Breadcrumb.vue';
import Json from '../components/Json.vue';
import Tree from '../components/Tree.vue';

onMounted(() => {});
</script>

<template>
    <div class="flex justify-center items-center min-h-screen bg-gray-50 px-4 py-8">
        <Layout>
            <Tree>
                <Breadcrumb :path="['Tree']"/>
            </Tree>
            <Json v-slot="{ breadcrumbPath }">
                <Breadcrumb :path="breadcrumbPath"/>
            </Json>
        </Layout>
    </div>
</template>

<style lang="css" scoped>
</style>
