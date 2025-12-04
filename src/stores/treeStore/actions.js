const DEFAULT_JSON = {
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "skills": ["Vue", "React", "Node.js"],
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "country": "USA"
  }
};

export default {
  setJsonData (jsonInput) {
    try {
      this.isLoading = true;
      this.error = '';

      // Trim input
      let trimmedInput = jsonInput.trim();

      // If empty, use default
      if (!trimmedInput) {
        this.jsonData = DEFAULT_JSON;
        return;
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
    } catch (err) {
      this.error = err.message || 'Invalid JSON format';
      // Don't change jsonData on error, keep current one
    } finally {
      this.isLoading = false;
    }
  },

  clearError () {
    this.error = '';
  },

  resetToDefault () {
    this.jsonData = DEFAULT_JSON;
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
