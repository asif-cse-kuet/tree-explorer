# JSON Tree Viewer & Editor

A production-grade interactive JSON tree visualization and manipulation application built with Vue 3, featuring drag-and-drop functionality, inline editing, and comprehensive CRUD operations.

## 📋 Table of Contents

- [Overview](#overview)
- [Why Vue.js?](#why-vuejs)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Docker Setup](#docker-setup)
- [Development](#development)
- [Production Build](#production-build)
- [Browser Support](#browser-support)

---

## 🎯 Overview

This application provides a powerful interface for visualizing, editing, and manipulating JSON data structures in a hierarchical tree format. It combines intuitive UI/UX with advanced features like drag-and-drop repositioning, real-time editing, and undo functionality.

**Use Cases:**

- JSON data exploration and debugging
- Configuration file editing
- API response visualization
- Hierarchical data structure management

---

## 🚀 Why Vue.js?

This project leverages **Vue 3** with the **Composition API** for several strategic reasons:

### Vue.js Advantages Over React

| Aspect                   | Vue.js                         | React                                      |
| ------------------------ | ------------------------------ | ------------------------------------------ |
| **Learning Curve**       | Gentler, HTML-like templates   | Steeper, JSX requires JavaScript knowledge |
| **Bundle Size**          | ~34KB (smaller)                | ~40KB+ (larger with dependencies)          |
| **Performance**          | Fine-grained reactivity system | Virtual DOM diffing                        |
| **State Management**     | Pinia (official, integrated)   | Redux/Zustand (third-party)                |
| **Build Tool**           | Vite (built-in, blazing fast)  | CRA/Vite (requires configuration)          |
| **Two-Way Binding**      | Native `v-model`               | Manual controlled components               |
| **Developer Experience** | Single File Components (.vue)  | JSX split across files                     |

### Specific Benefits for This Project

1. **Reactive Data Flow**: Vue's fine-grained reactivity automatically tracks changes in the JSON tree without manual optimization
2. **Template Syntax**: Cleaner HTML-like templates for complex nested tree structures
3. **Scoped Styles**: Component-level CSS scoping prevents style leakage in deeply nested trees
4. **Pinia Integration**: Official state management with TypeScript support and DevTools
5. **Vite Performance**: Hot Module Replacement (HMR) for instant feedback during development
6. **Smaller Bundle**: Critical for applications with complex UI interactions

---

## ✨ Features

### Core Features

#### 1. **JSON Import & Visualization**

- Import JSON via intuitive dialog
- Automatic validation and error handling
- Hierarchical tree rendering with expand/collapse

```json
// Example: Importing nested structure
{
  "users": {
    "admin": {
      "name": "John",
      "role": "Administrator"
    }
  }
}
```

#### 2. **Drag-and-Drop Repositioning**

- Move nodes anywhere in the tree
- Three drop modes:
  - **Before**: Insert as previous sibling
  - **After**: Insert as next sibling
  - **Inside**: Insert as first child
- Visual indicators (blue lines, green outline, orange parent boundary)
- Smart blocking (prevents invalid operations like root-level siblings)

```
Example:
[Node A]          Drag [Node C] to [Node A]
  ├─ [Node B]     Result: [Node A]
  └─ [Node C]              ├─ [Node C] (moved as first child)
                           └─ [Node B]
```

#### 3. **CRUD Operations**

**Create**:

- Blue **+** icon: Add child node (becomes first child)
- Floating input for quick node naming
- Handles edge cases: empty values preserved as `old_value`

**Read**:

- Expandable tree view
- Breadcrumb navigation
- Selection highlighting (full-width even on overflow)

**Update**:

- Double-click node labels for inline rename
- Keyboard shortcuts: Enter (confirm), Escape (cancel)
- Preserves key order during rename

**Delete**:

- Red **-** icon with confirmation dialog
- Prevents accidental root deletion
- Auto-selects parent after deletion

#### 4. **Undo Functionality**

- Undo last add/delete/rename action
- Single-click undo (last action only)
- Curved arrow icon in breadcrumb area
- Disabled state when no history available
- **Note**: Drag-drop operations are NOT undoable (by design)

```
Action Flow:
1. Rename "foo" → "bar"
2. Click undo button
3. Restores "foo" instantly
```

#### 5. **Advanced UI/UX**

- **Responsive Design**: Works on mobile, tablet, desktop
- **Horizontal Scrolling**: Handles deeply nested structures (1024px+ screens)
- **Selection on Interaction**: Click toggler or drag = auto-select
- **Empty Object Handling**: Allows drops on empty containers
- **Value Preservation**: Primitives converted to objects with `old_value` key

---

## 🏗️ Architecture

### Tech Stack

- **Frontend Framework**: Vue 3.5.13 (Composition API)
- **State Management**: Pinia 2.3.0 (official Vue store)
- **Build Tool**: Vite 6.0.3 (ESM-based, HMR)
- **CSS Framework**: Tailwind CSS 4.1.17
- **Persistence**: LocalStorage (via pinia-plugin-persistedstate)

### State Management Philosophy

**Pinia** was chosen over Vuex for:

- Simplified API (no mutations, just actions)
- Better TypeScript support
- Modular architecture (multiple stores)
- Composition API compatibility
- Built-in DevTools integration

---

## 📁 Project Structure

```
my-app/
├── public/                    # Static assets
├── src/
│   ├── assets/               # Styles and global assets
│   │   └── main.css          # Tailwind imports & global styles
│   │
│   ├── global/               # Shared global components
│   │   ├── Breadcrumb.vue    # Path navigation component
│   │   ├── DeleteConfirmDialog.vue  # Reusable confirmation modal
│   │   └── UndoButton.vue    # Undo last action button
│   │
│   ├── module/               # Feature modules
│   │   ├── components/       # Feature-specific components
│   │   │   ├── Json.vue      # JSON display panel (right side)
│   │   │   ├── JsonInput.vue # JSON import dialog
│   │   │   ├── Layout.vue    # Two-column layout wrapper
│   │   │   ├── Tree.vue      # Tree container with scroll handling
│   │   │   ├── TreeNode.vue  # Recursive tree node (core component)
│   │   │   ├── TreeNodeContent.vue  # Node label, edit, buttons
│   │   │   ├── TreeNodeDragHandler.vue  # Drag-drop logic & indicators
│   │   │   └── TreeJsonInput.vue  # JSON input with validation
│   │   │
│   │   └── pages/            # Page-level components
│   │       └── IndexPage.vue # Main application page
│   │
│   ├── stores/               # Pinia state management
│   │   ├── index.js          # Export all stores
│   │   └── treeStore/        # Tree state module
│   │       ├── index.js      # Store definition, getters, persist config
│   │       └── actions.js    # All state mutations (CRUD, drag-drop, undo)
│   │
│   ├── App.vue               # Root component
│   └── main.js               # Application entry point
│
├── index.html                # HTML entry point
├── jsconfig.json             # JavaScript configuration
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite build configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── README.md                 # This file
```

### Key File Purposes

#### Core Components

- **TreeNode.vue**: Recursive component rendering each node and its children. Handles expand/collapse, selection, and props propagation.
- **TreeNodeDragHandler.vue**: Wraps nodes with drag-and-drop functionality. Calculates drop zones (30/40/30 split), shows visual hints, handles drag events.
- **TreeNodeContent.vue**: Manages node UI (label, edit input, add button, delete button). Handles inline editing and add-child flow.

#### State Management

- **stores/treeStore/actions.js**: Contains all business logic:

  - `setJsonData()`: Validates and loads JSON
  - `deleteNode()`: Removes node with history tracking
  - `renameNode()`: Renames with order preservation
  - `addSiblingNode()`: Adds child as first element
  - `moveNode()`: Handles drag-drop repositioning
  - `undoLastAction()`: Restores previous state
  - `pushHistory()`: Saves state before mutations

- **stores/treeStore/index.js**: Defines state shape, getters, and persistence configuration.

#### Utilities

- **Breadcrumb.vue**: Displays current selection path (e.g., Tree > users > admin)
- **UndoButton.vue**: Toggle-able undo button (disabled when no history)
- **DeleteConfirmDialog.vue**: Modal with overlay for delete confirmation

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd my-app

# Install dependencies
npm install
```

### Development Server

```bash
# Start development server with HMR
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port).

**Development Features:**

- Hot Module Replacement (instant updates)
- Source maps for debugging
- Vue DevTools integration
- Pinia DevTools integration

### Environment Setup

No environment variables required for basic usage. The application uses browser localStorage for persistence.

---

## 🐳 Docker Setup

**[PLACEHOLDER]**

Docker configuration will be added to enable containerized deployment.

**Planned Docker Features:**

- Multi-stage build for optimized image size
- Nginx server for production serving
- Volume mounting for development
- Docker Compose for orchestration

**Coming Soon:**

```bash
# Build Docker image
docker build -t json-tree-viewer .

# Run container
docker run -p 8080:80 json-tree-viewer
```

---

## 🛠️ Development

### Recommended IDE Setup

- **VS Code** + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- Disable Vetur if installed (conflicts with Vue Official)

### Browser DevTools

**Chromium (Chrome, Edge, Brave):**

- [Vue.js DevTools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- Enable Custom Object Formatter in DevTools settings

**Firefox:**

- [Vue.js DevTools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
- [Enable Custom Object Formatter](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

### Code Organization Principles

1. **Component Decoupling**: Each component has a single responsibility
2. **State Centralization**: All state mutations go through Pinia actions
3. **Prop Drilling Minimization**: Uses Vue's provide/inject for deep trees
4. **Computed Properties**: Derived state calculated via getters
5. **Deep Cloning**: All state snapshots use `JSON.parse(JSON.stringify())`

### Best Practices Implemented

- ✅ Single File Components (SFC) for encapsulation
- ✅ Composition API for reusable logic
- ✅ Scoped styles to prevent CSS leakage
- ✅ Prop validation with TypeScript-style definitions
- ✅ Event handling with `e.stopPropagation()` for nested elements
- ✅ Error boundaries via try-catch in critical actions
- ✅ Rollback mechanism for failed operations
- ✅ History management with size limits

---

## 📦 Production Build

### Build for Production

```bash
# Create optimized production build
npm run build
```

**Output:**

- `dist/` folder with minified assets
- Code splitting for optimal loading
- Tree-shaking to eliminate dead code
- CSS extraction and minification

### Build Optimizations

- **Vite**: Uses Rollup for production bundling
- **Code Splitting**: Automatic chunk splitting for lazy loading
- **Tree Shaking**: Removes unused code
- **Minification**: Terser for JavaScript, cssnano for CSS
- **Asset Hashing**: Cache-busting via content hashes

### Deployment

The `dist/` folder can be served by any static hosting service:

```bash
# Preview production build locally
npm run preview
```

**Deployment Targets:**

- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Nginx/Apache servers

---

## 🌐 Browser Support

### Minimum Requirements

- Chrome/Edge: v90+
- Firefox: v88+
- Safari: v14+
- Opera: v76+

### Features Used

- ES6+ (async/await, spread operator)
- CSS Grid & Flexbox
- HTML5 Drag and Drop API
- LocalStorage API
- JSON.parse/stringify

### Progressive Enhancement

- Graceful fallback for browsers without drag-and-drop
- Mobile touch event handling
- Responsive breakpoints (sm, md, lg, xl)

---

## 📝 Additional Notes

### Performance Considerations

- **Lazy Rendering**: Only visible nodes are rendered (via expand/collapse)
- **Memoization**: Computed properties cache results
- **Event Delegation**: Minimized event listeners on parent elements
- **Virtual Scrolling**: Not implemented yet (consider for 1000+ nodes)

### Security Considerations

- **JSON Validation**: Server-side validation recommended for production
- **XSS Prevention**: Vue automatically escapes content
- **CSRF Protection**: Not applicable (client-side only app)
- **Content Security Policy**: Configure headers in production

### Accessibility (A11y)

- Keyboard navigation support
- ARIA labels on interactive elements
- Focus management for modals
- Screen reader compatible

### Future Enhancements

- [ ] Export modified JSON
- [ ] Search/filter nodes
- [ ] Multi-select for batch operations
- [ ] Redo functionality (complement undo)
- [ ] Keyboard shortcuts (Ctrl+Z for undo)
- [ ] Dark mode toggle
- [ ] Virtual scrolling for large datasets
- [ ] JSON schema validation

---

## 📄 License

[Add your license here]

## 🤝 Contributing

[Add contribution guidelines here]

## 📧 Contact

[Add contact information here]
