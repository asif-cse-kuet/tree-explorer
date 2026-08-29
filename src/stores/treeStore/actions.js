import { MAX_JSON_SIZE, sanitizeValue, isInvalidMove } from './utils'

export default {
  setJsonData (jsonInput) {
    try {
      this.isLoading = true
      this.error = ''
      this.history = []

      let trimmedInput = jsonInput.trim()

      if (!trimmedInput) {
        throw new Error('JSON input cannot be empty')
      }

      if (trimmedInput.length > MAX_JSON_SIZE) {
        throw new Error('JSON input exceeds 5MB limit')
      }

      trimmedInput = trimmedInput.replace(/,(\s*[}\]])/g, '$1')

      const parsedData = sanitizeValue(JSON.parse(trimmedInput))

      if (typeof parsedData !== 'object' || parsedData === null) {
        throw new Error('JSON must be an object or array')
      }

      this.jsonData = parsedData

      const rootKey = Object.keys(parsedData)[0]
      if (rootKey) {
        this.selectedPath = [rootKey]
      }
    } catch (err) {
      this.error = err.message || 'Invalid JSON format'
    } finally {
      this.isLoading = false
    }
  },

  setSelectedPath (path) {
    this.selectedPath = path
  },

  clearError () {
    this.error = ''
  },

  clearJsonData () {
    this.jsonData = null
    this.error = ''
    this.selectedPath = []
    this.history = []
  },

  getNodeByPath (path) {
    if (!this.jsonData) return null

    let current = this.jsonData
    for (const key of path) {
      if (typeof current === 'object' && current !== null && key in current) {
        current = current[key]
      } else {
        return null
      }
    }
    return current
  },

  deleteNode (path) {
    if (!this.jsonData || !path || path.length === 0) return

    if (path.length === 1) {
      this.error = 'Cannot delete root node'
      return
    }

    this.pushHistory()

    let current = this.jsonData
    for (let i = 0; i < path.length - 1; i++) {
      if (typeof current === 'object' && current !== null && path[i] in current) {
        current = current[path[i]]
      } else {
        return
      }
    }

    const nodeKey = path[path.length - 1]
    if (typeof current === 'object' && current !== null && nodeKey in current) {
      delete current[nodeKey]

      if (JSON.stringify(this.selectedPath) === JSON.stringify(path)) {
        this.selectedPath = path.slice(0, -1)
      }
    }
  },

  renameNode (path, newName) {
    if (!this.jsonData || !path || path.length === 0 || !newName) return

    newName = newName.trim()
    if (!newName) {
      this.error = 'Node name cannot be empty'
      return
    }

    const oldName = path[path.length - 1]

    if (path.length === 1) {
      this.pushHistory()

      const value = this.jsonData[oldName]
      const newData = {}

      for (const key in this.jsonData) {
        if (key === oldName) {
          newData[newName] = value
        } else {
          newData[key] = this.jsonData[key]
        }
      }

      this.jsonData = newData

      if (JSON.stringify(this.selectedPath) === JSON.stringify(path)) {
        this.selectedPath = [newName]
      }
      return
    }

    let current = this.jsonData
    for (let i = 0; i < path.length - 1; i++) {
      if (typeof current === 'object' && current !== null && path[i] in current) {
        current = current[path[i]]
      } else {
        return
      }
    }

    if (current[newName] !== undefined && newName !== oldName) {
      this.error = `Node "${newName}" already exists`
      return
    }

    this.pushHistory()

    if (typeof current === 'object' && current !== null && oldName in current) {
      const value = current[oldName]
      const newObj = {}

      for (const key in current) {
        if (key === oldName) {
          newObj[newName] = value
        } else {
          newObj[key] = current[key]
        }
      }

      for (const key in current) {
        delete current[key]
      }
      for (const key in newObj) {
        current[key] = newObj[key]
      }

      this.jsonData = JSON.parse(JSON.stringify(this.jsonData))

      if (JSON.stringify(this.selectedPath) === JSON.stringify(path)) {
        const newPath = [...path]
        newPath[newPath.length - 1] = newName
        this.selectedPath = newPath
      }
    }
  },

  moveNode (sourcePath, targetPath, dropPosition = 'before') {
    if (!this.jsonData || !sourcePath || !targetPath || sourcePath.length === 0 || targetPath.length === 0) return

    if (isInvalidMove(sourcePath, targetPath, dropPosition)) return

    const backup = JSON.parse(JSON.stringify(this.jsonData))

    try {
      let data = JSON.parse(JSON.stringify(this.jsonData))

      let sourceParent = data
      for (let i = 0; i < sourcePath.length - 1; i++) {
        sourceParent = sourceParent[sourcePath[i]]
      }
      const sourceKey = sourcePath[sourcePath.length - 1]
      const sourceNode = sourceParent[sourceKey]

      delete sourceParent[sourceKey]

      const sourceParentPath = sourcePath.slice(0, -1)
      const targetParentPath = targetPath.slice(0, -1)

      if (dropPosition === 'inside') {
        let targetNode = data
        for (const key of targetPath) {
          targetNode = targetNode[key]
        }

        if (typeof targetNode !== 'object' || targetNode === null || Array.isArray(targetNode)) {
          let parent = data
          for (let i = 0; i < targetPath.length - 1; i++) {
            parent = parent[targetPath[i]]
          }
          const lastKey = targetPath[targetPath.length - 1]
          const preserved = targetNode
          parent[lastKey] = { old_value: preserved }
          targetNode = parent[lastKey]
        }

        const ordered = { [sourceKey]: sourceNode }
        for (const k of Object.keys(targetNode)) {
          ordered[k] = targetNode[k]
        }
        for (const k in targetNode) delete targetNode[k]
        Object.assign(targetNode, ordered)

        if (JSON.stringify(this.selectedPath) === JSON.stringify(sourcePath)) {
          this.selectedPath = [...targetPath, sourceKey]
        }
      } else {
        let targetParent = data
        for (const key of targetParentPath) {
          targetParent = targetParent[key]
        }
        const targetKey = targetPath[targetPath.length - 1]

        const keys = Object.keys(targetParent)
        const targetIndex = keys.indexOf(targetKey)

        if (targetIndex === -1) {
          throw new Error('Target not found')
        }

        const insertIndex = dropPosition === 'before' ? targetIndex : targetIndex + 1

        const newParent = {}
        let inserted = false

        for (let i = 0; i < keys.length; i++) {
          if (i === insertIndex && !inserted) {
            newParent[sourceKey] = sourceNode
            inserted = true
          }

          const key = keys[i]
          if (!(JSON.stringify(sourceParentPath) === JSON.stringify(targetParentPath) && key === sourceKey)) {
            newParent[key] = targetParent[key]
          }
        }

        if (!inserted) {
          newParent[sourceKey] = sourceNode
        }

        if (targetParentPath.length === 0) {
          data = newParent
        } else {
          let parent = data
          for (let i = 0; i < targetParentPath.length - 1; i++) {
            parent = parent[targetParentPath[i]]
          }
          parent[targetParentPath[targetParentPath.length - 1]] = newParent
        }

        if (JSON.stringify(this.selectedPath) === JSON.stringify(sourcePath)) {
          this.selectedPath = [...targetParentPath, sourceKey]
        }
      }

      this.jsonData = JSON.parse(JSON.stringify(data))

      let verifyParent = this.jsonData
      const verifyPath = dropPosition === 'inside' ? [...targetPath, sourceKey] : [...targetParentPath, sourceKey]
      for (let i = 0; i < verifyPath.length - 1; i++) {
        verifyParent = verifyParent[verifyPath[i]]
      }
      if (!(verifyPath[verifyPath.length - 1] in verifyParent)) {
        throw new Error('Node not found at destination after move')
      }
    } catch (error) {
      console.error('Move operation failed:', error.message)
      this.jsonData = backup
    }
  },

  addSiblingNode (path, newNodeKey) {
    if (!this.jsonData || !path || path.length === 0 || !newNodeKey) {
      this.error = 'Invalid path or node name'
      return
    }
    newNodeKey = newNodeKey.trim()
    if (!newNodeKey) {
      this.error = 'Node name cannot be empty'
      return
    }
    this.pushHistory()
    try {
      let targetNode = this.jsonData
      const targetPath = path
      for (let i = 0; i < targetPath.length; i++) {
        if (typeof targetNode === 'object' && targetNode !== null && targetPath[i] in targetNode) {
          targetNode = targetNode[targetPath[i]]
        } else {
          this.error = 'Target path not found'
          return
        }
      }
      let newTargetValue
      const isEmptyOrNull =
        targetNode === '' ||
        targetNode === null ||
        targetNode === false ||
        (typeof targetNode === 'object' && !Array.isArray(targetNode) && Object.keys(targetNode).length === 0)

      if (isEmptyOrNull) {
        newTargetValue = { [newNodeKey]: {} }
      } else if (typeof targetNode === 'object' && !Array.isArray(targetNode)) {
        newTargetValue = { [newNodeKey]: {}, ...targetNode }
      } else {
        newTargetValue = { [newNodeKey]: {}, old_value: targetNode }
      }

      if (targetPath.length === 0) {
        this.error = 'Cannot add child to root'
        return
      }
      let parent = this.jsonData
      const parentPath = targetPath.slice(0, -1)
      for (let i = 0; i < parentPath.length; i++) {
        if (typeof parent === 'object' && parent !== null && parentPath[i] in parent) {
          parent = parent[parentPath[i]]
        } else {
          this.error = 'Parent path not found'
          return
        }
      }
      const targetKey = targetPath[targetPath.length - 1]
      parent[targetKey] = newTargetValue
      this.jsonData = JSON.parse(JSON.stringify(this.jsonData))
      const newChildPath = [...targetPath, newNodeKey]
      this.selectedPath = newChildPath
    } catch (error) {
      console.error('Add child operation failed:', error.message)
      this.error = 'Failed to add child node'
    }
  },

  pushHistory () {
    this.history = []
    this.history.push({
      jsonData: JSON.parse(JSON.stringify(this.jsonData)),
      selectedPath: [...this.selectedPath],
    })
  },

  undoLastAction () {
    if (this.history.length === 0) {
      this.error = 'Nothing to undo'
      return
    }
    try {
      const previousState = this.history.pop()
      this.jsonData = previousState.jsonData
      this.selectedPath = previousState.selectedPath
      this.error = ''
    } catch (error) {
      console.error('Undo operation failed:', error.message)
      this.error = 'Failed to undo'
    }
  }
}
