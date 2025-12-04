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
  }
}
