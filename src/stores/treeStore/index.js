import { defineStore } from 'pinia'
import actions from './actions'

export const useTreeStore = defineStore('tree', {
  state: () => ({
    jsonData: null,
    error: '',
    isLoading: false,
    currentPath: [],
    selectedPath: [],
  }),
  getters: {
    hasData: (state) => state.jsonData !== null && typeof state.jsonData === 'object' && Object.keys(state.jsonData).length > 0,
    treeNodes: (state) => state.jsonData,
  },
  actions,
  persist: {
    key: 'tree-store',
    storage: localStorage,
  },
})
