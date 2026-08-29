import { defineStore } from 'pinia'
import actions from './actions'

export const useTreeStore = defineStore('tree', {
  state: () => ({
    jsonData: null,
    error: '',
    isLoading: false,
    selectedPath: [],
    history: [], // For Tracking undo history for add/delete/rename only
  }),
  getters: {
    hasData: (state) => state.jsonData !== null && typeof state.jsonData === 'object' && Object.keys(state.jsonData).length > 0,
    treeNodes: (state) => state.jsonData,
    canUndo: (state) => state.history.length > 0,
  },
  actions,
  persist: {
    key: 'tree-store',
    storage: localStorage,
    paths: ['jsonData', 'selectedPath'], // Don't persist history
  },
})
