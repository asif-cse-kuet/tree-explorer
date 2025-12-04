<script setup>
import { ref } from 'vue';

const props = defineProps({
  nodeKey: {
    type: String,
    required: true
  },
  nodeValue: {
    type: [Object, String, Number, Boolean],
    required: true
  },
  path: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    default: 0
  }
});

const isExpanded = ref(true);

const toggleNode = () => {
  isExpanded.value = !isExpanded.value;
};

const isObject = (value) => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

const hasChildren = (value) => {
  return isObject(value) && Object.keys(value).length > 0;
};
</script>

<template>
  <div class="tree__node" :style="{ paddingLeft: level > 0 ? '35px' : '0' }">
    <div class="node-header" @click="hasChildren(nodeValue) && toggleNode()">
      <!-- Arrow icon for nodes with children -->
      <span v-if="hasChildren(nodeValue)" class="toggle-arrow">
        <svg 
          :class="{ 'rotate-90': isExpanded }"
          class="arrow-icon"
          viewBox="0 0 24 24" 
          fill="none"
          stroke="currentColor" 
          stroke-width="2"
          width="16"
          height="16"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </span>
      <!-- Spacer for leaf nodes -->
      <span v-else class="toggle-spacer"></span>
      
      <!-- Node label -->
      <span class="node-label" :class="{ 'cursor-pointer': hasChildren(nodeValue) }">
        {{ nodeKey }}
      </span>
    </div>

    <!-- Children nodes -->
    <div v-if="hasChildren(nodeValue) && isExpanded" class="tree__children">
      <TreeNode 
        v-for="(childValue, childKey) in nodeValue" 
        :key="childKey"
        :nodeKey="String(childKey)" 
        :nodeValue="childValue" 
        :path="`${path}.${childKey}`"
        :level="level + 1"
      />
    </div>
  </div>
</template>

<style scoped>
.tree__node {
  position: relative;
  margin: 2px 0;
}

.node-header {
  display: flex;
  align-items: center;
  position: relative;
  padding: 4px 0;
}

.node-header:before {
  content: "";
  position: absolute;
  top: -3px;
  bottom: 50%;
  width: 25px;
  left: -23px;
  border-left: 2px solid #5d5e5e;
  border-bottom: 2px solid #5d5e5e;
}

.tree__node:after {
  content: "";
  position: absolute;
  top: -3px;
  bottom: 0;
  width: 2px;
  right: auto;
  left: 12px;
  border-left: 2px solid #5d5e5e;
}

.tree__node:last-child:after {
  display: none;
}

.toggle-arrow {
  display: inline-flex;
  align-items: center;
  margin-right: 6px;
  margin-left: 6px;
  cursor: pointer;
}

.arrow-icon {
  transition: transform 0.2s ease;
}

.arrow-icon.rotate-90 {
  transform: rotate(0deg);
}

.toggle-spacer {
  display: inline-block;
  width: 5px;
  margin-left: 2px;
}

.node-label {
  font-weight: 400;
}

.node-label.cursor-pointer {
  cursor: pointer;
}

.node-label:hover {
  color: #1f2937;
}

.tree__children {
  position: relative;
}
</style>
