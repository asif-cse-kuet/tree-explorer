import { defineStore } from 'pinia'
import actions from './actions'

export const useTreeStore = defineStore('tree', {
  state: () => ({
    jsonData: {
  "auto": {
            "driver_types": {
                "auto": true,
                "img_url": "",
                "is_active": true,
                "is_open_for_signup": true,
                "name": {
                    "bn": "",
                    "en": ""
                },
            },
            "verify_otp_for_signup": false
        },
    },
    error: '',
    isLoading: false,
    currentPath: [],
  }),
  getters: {
    hasData: (state) => state.jsonData !== null && Object.keys(state.jsonData).length > 0,
    treeNodes: (state) => state.jsonData,
  },
  actions,
})
