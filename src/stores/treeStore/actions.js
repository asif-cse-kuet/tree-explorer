export default {
  setJsonData (jsonInput) {
    try {
      this.isLoading = true;
      this.error = '';

      // Trim input
      let trimmedInput = jsonInput.trim();

      // If empty, show error
      if (!trimmedInput) {
        throw new Error('JSON input cannot be empty');
      }

      // Remove trailing commas before closing braces/brackets (common JSON5 pattern)
      trimmedInput = trimmedInput.replace(/,(\s*[}\]])/g, '$1');

      // Parse JSON
      const parsedData = JSON.parse(trimmedInput);

      // Validate that it's an object or array
      if (typeof parsedData !== 'object' || parsedData === null) {
        throw new Error('JSON must be an object or array');
      }

      this.jsonData = parsedData;
      
      // Set root node as selected by default
      const rootKey = Object.keys(parsedData)[0];
      if (rootKey) {
        this.selectedPath = [rootKey];
      }
    } catch (err) {
      this.error = err.message || 'Invalid JSON format';
      // Don't change jsonData on error, keep current one
    } finally {
      this.isLoading = false;
    }
  },

  setSelectedPath (path) {
    this.selectedPath = path;
  },

  clearError () {
    this.error = '';
  },

  clearJsonData () {
    this.jsonData = null;
    this.error = '';
  },

  updateCurrentPath (newPath) {
    this.currentPath = newPath;
  },

  getNodeByPath (path) {
    if (!this.jsonData) return null;
    
    let current = this.jsonData;
    for (const key of path) {
      if (typeof current === 'object' && current !== null && key in current) {
        current = current[key];
      } else {
        return null;
      }
    }
    return current;
  },

  deleteNode (path) {
    if (!this.jsonData || !path || path.length === 0) return;
    
    // Don't allow deleting root node
    if (path.length === 1) {
      this.error = 'Cannot delete root node';
      return;
    }

    // Navigate to parent
    let current = this.jsonData;
    for (let i = 0; i < path.length - 1; i++) {
      if (typeof current === 'object' && current !== null && path[i] in current) {
        current = current[path[i]];
      } else {
        return;
      }
    }

    // Delete the node
    const nodeKey = path[path.length - 1];
    if (typeof current === 'object' && current !== null && nodeKey in current) {
      delete current[nodeKey];
      
      // If deleted node was selected, select parent
      if (JSON.stringify(this.selectedPath) === JSON.stringify(path)) {
        this.selectedPath = path.slice(0, -1);
      }
    }
  },

  renameNode (path, newName) {
    if (!this.jsonData || !path || path.length === 0 || !newName) return;
    
    // Trim the new name
    newName = newName.trim();
    if (!newName) {
      this.error = 'Node name cannot be empty';
      return;
    }

    const oldName = path[path.length - 1];
    
    // If renaming root node
    if (path.length === 1) {
      const value = this.jsonData[oldName];
      const newData = {};
      
      // Preserve order by iterating and renaming
      for (const key in this.jsonData) {
        if (key === oldName) {
          newData[newName] = value;
        } else {
          newData[key] = this.jsonData[key];
        }
      }
      
      this.jsonData = newData;
      
      // Update selected path if this node was selected
      if (JSON.stringify(this.selectedPath) === JSON.stringify(path)) {
        this.selectedPath = [newName];
      }
      return;
    }

    // Navigate to parent
    let current = this.jsonData;
    for (let i = 0; i < path.length - 1; i++) {
      if (typeof current === 'object' && current !== null && path[i] in current) {
        current = current[path[i]];
      } else {
        return;
      }
    }

    // Check if new name already exists
    if (current[newName] !== undefined && newName !== oldName) {
      this.error = `Node "${newName}" already exists`;
      return;
    }

    // Rename the node - preserve order by rebuilding object
    if (typeof current === 'object' && current !== null && oldName in current) {
      const value = current[oldName];
      const newObj = {};
      
      // Iterate through keys and rebuild with renamed key in same position
      for (const key in current) {
        if (key === oldName) {
          newObj[newName] = value;
        } else {
          newObj[key] = current[key];
        }
      }
      
      // Replace the current object with the new one maintaining order
      for (const key in current) {
        delete current[key];
      }
      for (const key in newObj) {
        current[key] = newObj[key];
      }
      
      // Update selected path if this node was selected
      if (JSON.stringify(this.selectedPath) === JSON.stringify(path)) {
        const newPath = [...path];
        newPath[newPath.length - 1] = newName;
        this.selectedPath = newPath;
      }
    }
  },

  moveNode (sourcePath, targetPath, dropPosition = 'before') {
    if (!this.jsonData || !sourcePath || !targetPath || sourcePath.length === 0 || targetPath.length === 0) return;
    
    // Don't move a node to itself
    if (JSON.stringify(sourcePath) === JSON.stringify(targetPath)) return;
    
    // Keep backup of original data for rollback
    const backup = JSON.parse(JSON.stringify(this.jsonData));
    
    try {
      // Work with cloned data
      let data = JSON.parse(JSON.stringify(this.jsonData));
      
      // Extract source node
      let sourceParent = data;
      for (let i = 0; i < sourcePath.length - 1; i++) {
        sourceParent = sourceParent[sourcePath[i]];
      }
      const sourceKey = sourcePath[sourcePath.length - 1];
      const sourceNode = sourceParent[sourceKey];
      
      // Remove from source
      delete sourceParent[sourceKey];
      
      // Determine destination
      const sourceParentPath = sourcePath.slice(0, -1);
      const targetParentPath = targetPath.slice(0, -1);
      
      if (dropPosition === 'inside') {
        // Add inside target node as FIRST child. If target isn't an object, promote it and preserve prior value.
        let targetNode = data;
        for (const key of targetPath) {
          targetNode = targetNode[key];
        }
        
        if (typeof targetNode !== 'object' || targetNode === null || Array.isArray(targetNode)) {
          // Promote primitive/array/null to an object and keep old value under old_value
          let parent = data;
          for (let i = 0; i < targetPath.length - 1; i++) {
            parent = parent[targetPath[i]];
          }
          const lastKey = targetPath[targetPath.length - 1];
          const preserved = targetNode;
          parent[lastKey] = { old_value: preserved };
          targetNode = parent[lastKey];
        }
        
        // Insert as first child by rebuilding object with new key first
        const ordered = { [sourceKey]: sourceNode };
        for (const k of Object.keys(targetNode)) {
          ordered[k] = targetNode[k];
        }
        // Replace targetNode contents in place
        for (const k in targetNode) delete targetNode[k];
        Object.assign(targetNode, ordered);
        
        // Update selection
        if (JSON.stringify(this.selectedPath) === JSON.stringify(sourcePath)) {
          this.selectedPath = [...targetPath, sourceKey];
        }
      } else {
        // Add as sibling (before or after target)
        let targetParent = data;
        for (const key of targetParentPath) {
          targetParent = targetParent[key];
        }
        const targetKey = targetPath[targetPath.length - 1];
        
        // Get all keys
        const keys = Object.keys(targetParent);
        const targetIndex = keys.indexOf(targetKey);
        
        if (targetIndex === -1) {
          throw new Error('Target not found');
        }
        
        // Calculate insert position
        const insertIndex = dropPosition === 'before' ? targetIndex : targetIndex + 1;
        
        // Create new ordered object
        const newParent = {};
        let inserted = false;
        
        for (let i = 0; i < keys.length; i++) {
          // Insert source at the right position
          if (i === insertIndex && !inserted) {
            newParent[sourceKey] = sourceNode;
            inserted = true;
          }
          
          // Add existing key (skip if it's the same as sourceKey from same parent)
          const key = keys[i];
          if (!(JSON.stringify(sourceParentPath) === JSON.stringify(targetParentPath) && key === sourceKey)) {
            newParent[key] = targetParent[key];
          }
        }
        
        // If not inserted yet, add at end
        if (!inserted) {
          newParent[sourceKey] = sourceNode;
        }
        
        // Replace parent by updating data reference
        if (targetParentPath.length === 0) {
          // Root level - replace the entire root object with the new ordered one
          data = newParent;
        } else {
          // Nested - navigate and replace
          let parent = data;
          for (let i = 0; i < targetParentPath.length - 1; i++) {
            parent = parent[targetParentPath[i]];
          }
          parent[targetParentPath[targetParentPath.length - 1]] = newParent;
        }
        
        // Update selection - always update to new location
        if (JSON.stringify(this.selectedPath) === JSON.stringify(sourcePath)) {
          this.selectedPath = [...targetParentPath, sourceKey];
        }
      }
      
      // Force complete re-render by parsing and re-setting
      this.jsonData = JSON.parse(JSON.stringify(data));
      
      // Verify the node exists at new location
      let verifyParent = this.jsonData;
      const verifyPath = dropPosition === 'inside' ? [...targetPath, sourceKey] : [...targetParentPath, sourceKey];
      for (let i = 0; i < verifyPath.length - 1; i++) {
        verifyParent = verifyParent[verifyPath[i]];
      }
      if (!(verifyPath[verifyPath.length - 1] in verifyParent)) {
        throw new Error('Node not found at destination after move');
      }
      
    } catch (error) {
      console.error('Move operation failed:', error.message);
      this.jsonData = backup;
    }
  },
  
  validateMoveResult(data, targetParentPath, sourceKey, dropPosition, targetPath) {
    try {
      // Navigate to where the node should be
      let checkParent = data;
      
      if (dropPosition === 'inside') {
        // Should be inside target
        for (const key of targetPath) {
          checkParent = checkParent[key];
        }
        return sourceKey in checkParent;
      } else {
        // Should be in target parent
        for (const key of targetParentPath) {
          checkParent = checkParent[key];
        }
        return sourceKey in checkParent;
      }
    } catch {
      return false;
    }
  },

  addSiblingNode (path, newNodeKey) {
    if (!this.jsonData || !path || path.length === 0 || !newNodeKey) {
      this.error = 'Invalid path or node name';
      return;
    }

    // Trim the new name
    newNodeKey = newNodeKey.trim();
    if (!newNodeKey) {
      this.error = 'Node name cannot be empty';
      return;
    }

    try {
      // Navigate to the target node (which will become the parent)
      let targetNode = this.jsonData;
      const targetPath = path;
      
      for (let i = 0; i < targetPath.length; i++) {
        if (typeof targetNode === 'object' && targetNode !== null && targetPath[i] in targetNode) {
          targetNode = targetNode[targetPath[i]];
        } else {
          this.error = 'Target path not found';
          return;
        }
      }

      // Handle different value types
      let newTargetValue;
      const isEmptyOrNull = 
        targetNode === '' || 
        targetNode === null || 
        targetNode === false ||
        (typeof targetNode === 'object' && !Array.isArray(targetNode) && Object.keys(targetNode).length === 0);

      if (isEmptyOrNull) {
        // If empty/null, just convert to object with new child
        newTargetValue = { [newNodeKey]: {} };
      } else if (typeof targetNode === 'object' && !Array.isArray(targetNode)) {
        // If it's already an object, add new child as first child
        newTargetValue = { [newNodeKey]: {}, ...targetNode };
      } else {
        // If it has a primitive value, preserve it and add new child
        newTargetValue = { [newNodeKey]: {}, old_value: targetNode };
      }

      // Navigate to parent and update
      if (targetPath.length === 0) {
        // Target is root, can't update
        this.error = 'Cannot add child to root';
        return;
      }

      let parent = this.jsonData;
      const parentPath = targetPath.slice(0, -1);
      
      for (let i = 0; i < parentPath.length; i++) {
        if (typeof parent === 'object' && parent !== null && parentPath[i] in parent) {
          parent = parent[parentPath[i]];
        } else {
          this.error = 'Parent path not found';
          return;
        }
      }

      const targetKey = targetPath[targetPath.length - 1];
      parent[targetKey] = newTargetValue;

      // Force re-render
      this.jsonData = JSON.parse(JSON.stringify(this.jsonData));

      // Select the newly created child
      const newChildPath = [...targetPath, newNodeKey];
      this.selectedPath = newChildPath;

    } catch (error) {
      console.error('Add child operation failed:', error.message);
      this.error = 'Failed to add child node';
    }
  }
}

