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
  }
}
