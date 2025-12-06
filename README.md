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

# 🎯 Overview

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

| Aspect                   | Vue.js                                                    | React                                                             |
| ------------------------ | --------------------------------------------------------- | ----------------------------------------------------------------- |
| **Learning Curve**       | Gentler, HTML-like templates                              | Steeper, JSX requires JavaScript knowledge                        |
| **Bundle Size**          | Vue core runtime is smaller; actual bundle depends on app | React + ReactDOM baseline is larger; actual bundle depends on app |
| **Performance**          | Fine-grained reactivity system                            | Virtual DOM diffing                                               |
| **State Management**     | Pinia (official, integrated)                              | Redux/Zustand (third-party)                                       |
| **Build Tool**           | Vite (built-in, blazing fast)                             | CRA/Vite (requires configuration)                                 |
| **Two-Way Binding**      | Native `v-model`                                          | Manual controlled components                                      |
| **Developer Experience** | Single File Components (.vue)                             | JSX split across files                                            |

### Specific Benefits for This Project

1. **Reactive Data Flow**: Vue's fine-grained reactivity automatically tracks changes in the JSON tree without manual optimization
2. **Template Syntax**: Cleaner HTML-like templates for complex nested tree structures
3. **Scoped Styles**: Component-level CSS scoping prevents style leakage in deeply nested trees
4. **Pinia Integration**: Official state management with TypeScript support and DevTools
5. **Vite Performance**: Hot Module Replacement (HMR) for instant feedback during development
6. **Smaller Bundle**: Critical for applications with complex UI interactions

---

## ✨ Features Implemented

This project implements a **VSCode Explorer-style collapsible tree component** with comprehensive JSON manipulation capabilities. The application is divided into two main sections:

### **Left Panel: Tree Explorer**

A fully interactive tree view for navigating and manipulating JSON object hierarchies.

### **Right Panel: Main Viewport**

Displays real-time breadcrumb navigation and formatted JSON representation of the current data structure.

---

## Required Features (Must-Have) ✅

### 1. **JSON Import System**

- **Import Button**: Opens a modal dialog for JSON input
- **User Input**: Accepts raw JSON text from users
- **Validation**: Automatic JSON validation with error feedback
- **Tree Rendering**: Converts valid JSON into an expandable/collapsible tree structure
- **Proper Nesting**: Maintains object hierarchy with visual indentation

```json
// Example: Import this structure
{
  "users": {
    "admin": {
      "name": "John",
      "role": "Administrator"
    }
  }
}
```

### 2. **Tree Navigation & Interaction**

- **Node Labels**: Each node displays the key name from the object
- **Expandable Nodes**: Nodes with children show a caret/arrow icon
- **Toggle Behavior**: Click caret to expand/collapse child nodes
- **Node Selection**: Click any node to highlight and select it
- **Breadcrumb Display**: Shows exact location in tree hierarchy (e.g., `Tree > users > admin`)

### 3. **Delete Functionality**

- **Delete Button**: Red **-** icon appears on each node
- **Child Deletion**: Delete any node that is a child of another node
- **Confirmation Modal**: Shows confirmation dialog before deleting
- **Root Protection**: Root node cannot be deleted (safety constraint)
- **Parent Selection**: After deletion, parent node is auto-selected
- **Real-time Update**: Main viewport JSON updates immediately after deletion

### 4. **Data Persistence**

- **LocalStorage**: All tree modifications are persisted locally
- **Page Refresh**: Tree state survives browser refresh
- **Automatic Sync**: Changes are saved automatically on every operation

### 5. **Main Viewport Features**

- **Breadcrumb Navigation**: Real-time path display showing selected node location
- **JSON Display**: Read-only formatted JSON representation
- **Live Updates**: Object structure updates instantly on any tree modification
- **Synchronized State**: Left tree and right JSON are always in sync

---

## Bonus Features (Nice-to-Have) ✅

### 1. **Add Node Functionality** ✅

- **Add Button**: Blue **+** icon on each node
- **Floating Input**: Quick inline input for new node names
- **Root Addition**: Can add nodes to root level
- **Child Addition**: New nodes become first child of selected parent
- **Empty Value Handling**: Empty names preserved as `old_value`

**Edge Cases & Examples:**

```json
// Original tree
{
  "users": {
    "admin": "John",
    "max_usr":50,
    "general":""
  }
}

// Case 1: Add to key that's value is empty
// Click + on "general" → Enter "guest"
{
  "users": {     // New node with empty value
    "admin": "John",
    "max_usr":50,
    "general": {
      "guest":""
    }
  }
}

// Case 2: Add to a node that has value
// Click + on "max_usr" → Enter channel
{
  "users": {
    "admin": "John",
    "max_usr":{
      "channel": "",
      "old_value": 50,  // Fallback for old value
    },
    "general": {
      "guest":""
    }
  }
}

// Case 3: Add to deeply nested object
// Works at any depth level
{
  "level1": {
    "level2": {
      "level3": {
        "newNode": ""  // Added at any nesting level
      }
    }
  }
}
```

**Behavior Notes:**

- New nodes always appear as **first child** (inserted at top)
- Adding to a primitive value converts it to an object
- Original value preserved as `old_value` key
- Focus automatically moves to input field when + is clicked

### 2. **Rename Node Functionality** ✅

- **Double-click to Edit**: Double-click any node label to rename
- **Inline Editing**: Edit directly in the tree without modal
- **Keyboard Shortcuts**:
  - **Enter**: Confirm rename
  - **Escape**: Cancel rename
- **Key Order Preservation**: Maintains object key order after rename

### 3. **Undo Last Action** ✅

- **Undo Button**: Curved arrow icon in breadcrumb area
- **Supported Actions**: Undo add, delete, and rename operations
- **Single-level Undo**: Restores last action only (1 history item)
- **Visual State**: Button disabled when no history available
- **Instant Rollback**: Changes revert immediately on click

**Action Flow Example:**

```
1. Rename "foo" → "bar"
2. Click undo button
3. Restores "foo" instantly
```

**Note:** Drag-drop operations are NOT undoable by design (Not asked on the task).

### 4. **Drag-and-Drop Re-parenting** ✅

- **Full Drag Support**: Move nodes anywhere in the tree
- **Three Drop Modes**:
  - **Before**: Insert as previous sibling (blue line indicator)
  - **After**: Insert as next sibling (blue line indicator)
  - **Inside**: Insert as first child (green outline)
- **Visual Cues**:
  - **Blue horizontal line**: Appears BEFORE or AFTER target node for sibling placement
  - **Green highlight**: Target node lights up when dropping INSIDE as child
  - **Orange boundary**: Indicates parent's bottom and it's first child's top container edge during drag, adds the new node as first child of the parent.
- **Smart Constraints**: Prevents invalid operations (e.g., dragging parent into its own child)

**Example:**

```
Initial Tree:
[Root]
  ├─ [foo]
  │    ├─ [bar]
  │    └─ [baz]
  └─ [hello]
       ├─ [world]
       │    ├─ [nested]
       │    └─ [deep]
       └─ [test]

***Scenario 1: Drag [baz] and drop on [hello]
- Drop zone: Top 30% (BEFORE) → Blue line appears ABOVE [hello]
  Result: [baz] becomes sibling BEFORE [hello]

- Drop zone: Middle 40% (INSIDE) → [hello] turns GREEN
  Result: [baz] becomes first child of [hello]

- Drop zone: Bottom 30% (AFTER) → Blue line appears BELOW [hello]
  Result: [baz] becomes sibling AFTER [hello]

***Scenario 2: Drag [test] and drop on [nested]
- Drop INSIDE (green) → [test] moves inside [nested] as first child

***Scenario 3: Drag [deep] and drop on [bar]
- Drop BEFORE (orange line above as this is in between first child and parent) → [deep] becomes previous sibling of [bar]
- Drop AFTER (blue line below) → [deep] becomes next sibling of [bar]

Tree (after dropping [baz] INSIDE [hello]):
[Root]
  ├─ [foo]
  │    └─ [bar]
  └─ [hello]
       ├─ [baz]       ← Moved here
       ├─ [world]
       │    ├─ [nested]
       │    └─ [deep]
       └─ [test]
```

#Few more examples:

```
[Root]
  ├─ [Node A]
  │    ├─ [Node A1]
  │    └─ [Node A2]
  └─ [Node B]
       ├─ [Node B1]
       └─ [Node C]

Drag [Node C] to [Node A]:
- **Drop INSIDE** (green highlight): `Node C` becomes first child of `Node A`
  Result:
  [Root]
    ├─ [Node A]
    │    ├─ [Node C]  (moved)
    │    ├─ [Node A1]
    │    └─ [Node A2]
    └─ [Node B]
         └─ [Node B1]

- **Drop BEFORE** (blue line): `Node C` becomes sibling of `Node A`
  Result (drop BEFORE A):
  [Root]
    ├─ [Node C]  (moved as sibling)
    ├─ [Node A]
    │    ├─ [Node A1]
    │    └─ [Node A2]
    └─ [Node B]
         └─ [Node B1]

  **Drop AFTER** (blue line): `Node C` becomes sibling of `Node A`
  Result (drop After A):
  [Root]
    ├─ [Node A]
    │    ├─ [Node A1]
    │    └─ [Node A2]
    ├─ [Node C]  (moved as sibling)
    └─ [Node B]
         └─ [Node B1]

  **Drop BEFORE Node A1** (orange line): `Node C` becomes sibling of `Node A1`
  Result (drop After A):
  [Root]
    ├─ [Node A]
    │    ├─ [Node C]  (moved as sibling of A1, Child of A)
    │    ├─ [Node A1]
    │    └─ [Node A2]
    └─ [Node B]
         └─ [Node B1]
```

**Visual Drop Zones:**

```
┌────────────────────────────────┐
│ ← 30% BEFORE (blue in general) │
│ (orange if the node is the     │  Top third: Insert as previous sibling
│ first child of a parent)       │
├────────────────────────────────┤
│ ← 40% INSIDE (green)           │  Middle: Insert as first child
├────────────────────────────────┤
│ ← 30% AFTER (blue)             │  Bottom third: Insert as next sibling
└────────────────────────────────┘
```

### 5. **Formatted JSON Display** ✅

- **Pretty Print**: JSON displayed with proper indentation
- **Syntax Highlighting**: Object structure clearly visible
- **Real-time Sync**: Updates immediately on tree modifications
- **Read-only View**: Main viewport JSON is for display only

---

## Additional UI/UX Enhancements

- **Responsive Design**: Works on mobile, tablet, and desktop
- **Horizontal Scrolling**: Handles deeply nested structures on any screen size
- **Selection on Interaction**: Clicking toggle or dragging auto-selects nodes
- **Empty Object Handling**: Can drop nodes into empty containers
- **Full-width Selection**: Selection highlight spans entire row even with overflow

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

my-app/
├── public/ # Static assets
├── src/
│ ├── assets/ # Styles and global assets
│ │ └── main.css # Tailwind imports & global styles
│ │
│ ├── global/ # Shared global components
│ │ ├── Breadcrumb.vue # Path navigation component
│ │ ├── DeleteConfirmDialog.vue # Reusable confirmation modal
│ │ └── UndoButton.vue # Undo last action button
│ │
│ ├── module/ # Feature modules
│ │ ├── components/ # Feature-specific components
│ │ │ ├── Json.vue # JSON display panel (right side)
│ │ │ ├── JsonInput.vue # JSON import dialog
│ │ │ ├── Layout.vue # Two-column layout wrapper
│ │ │ ├── Tree.vue # Tree container with scroll handling
│ │ │ ├── TreeNode.vue # Recursive tree node (core component)
│ │ │ ├── TreeNodeContent.vue # Node label, edit, buttons
│ │ │ ├── TreeNodeDragHandler.vue # Drag-drop logic & indicators
│ │ │ └── TreeJsonInput.vue # JSON input with validation
│ │ │
│ │ └── pages/ # Page-level components
│ │ └── IndexPage.vue # Main application page
│ │
│ ├── stores/ # Pinia state management
│ │ ├── index.js # Export all stores
│ │ └── treeStore/ # Tree state module
│ │ ├── index.js # Store definition, getters, persist config
│ │ └── actions.js # All state mutations (CRUD, drag-drop, undo)
│ │
│ ├── App.vue # Root component
│ └── main.js # Application entry point
│
├── index.html # HTML entry point
├── Dockerfile # Production multi-stage build
├── Dockerfile.dev # Development image with HMR
├── docker-compose.yml # Production orchestration
├── docker-compose.dev.yml # Development orchestration
├── nginx.conf # Nginx configuration
├── .dockerignore # Docker build context ignores
├── .env.example # Environment variable template
├── jsconfig.json # JavaScript configuration
├── package.json # Dependencies and scripts
├── package-lock.json # Locked dependency tree
├── vite.config.js # Vite build configuration
├── tailwind.config.js # Tailwind CSS configuration
└── README.md # This file

````

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
````

### Getting Started - Choose Your Path

After cloning and installing, you have **two options** to run the application:

---

## 🚀 Option A: Traditional NPM (Without Docker)

**Best for:** Local development, learning, quick setup

```bash
# Start development server with HMR
npm run dev
```

**Access:** `http://localhost:5173`

**Features:**

- ✅ Hot Module Replacement (instant updates)
- ✅ Source maps for debugging
- ✅ Vue DevTools integration
- ✅ Pinia DevTools integration

**Requirements:**

- Node.js v18+ installed locally
- No Docker needed

---

## 🐳 Option B: Docker (Containerized)

**Best for:** Production deployment, consistent environments, team collaboration

**Prerequisites:**

- Docker Desktop installed and running (see [Install Docker Desktop](#install-docker-desktop) section)

**Development with Docker:**

```bash
docker-compose -f docker-compose.dev.yml up
```

**Access:** `http://localhost:5173` (with HMR support)

**Production with Docker:**

```bash
docker-compose up -d
```

Access at: `http://localhost:8080`

**Benefits:**

- ✅ Containerized environment
- ✅ Production-ready configuration
- ✅ Same environment on all machines
- ✅ Easy deployment to cloud services

---

### Environment Setup

No environment variables required for basic usage. The application uses browser localStorage for persistence.

---

## 🐳 Docker Setup

### Overview Docker

The application includes production-grade Docker configuration with:

- **Multi-stage builds** with current production image ~97MB
- **Nginx** as production web server
- **Security headers** and best practices
- **Health checks** for container orchestration
- **Development mode** with hot reload support

### Prerequisites

**Required:**

- **Docker**: v20.10+
- **Docker Compose**: v2.0+ (included with Docker Desktop)
- **Docker Daemon**: Must be running before executing docker commands

#### Important: Docker Daemon Must Be Running

Before running any Docker commands, ensure Docker Desktop (or Docker daemon) is actively running on your machine. Without it, all Docker commands will fail.

**Common Error (Docker not running):**

```
error during connect: Get "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine": The system cannot find the file specified.
```

### Install Docker Desktop

Follow the official Docker installation guide for your operating system:

#### Windows

1. **Download Docker Desktop for Windows:**

   - Go to: https://docs.docker.com/desktop/setup/install/windows-install/
   - Download the installer for your processor:
     - Intel/AMD: Docker Desktop Installer.exe
     - ARM64: Docker Desktop Installer (ARM).exe

2. **Install Docker Desktop:**

   - Run the installer
   - Follow the installation wizard
   - Choose "Install required Windows components for WSL 2" (recommended)
   - Restart your computer when prompted

3. **Start Docker Desktop:**

   - Search "Docker Desktop" in Windows Start Menu
   - Click to launch
   - Wait for the status indicator to show "Docker is running" (green icon in system tray)

4. **Verify Installation:**
   ```powershell
   docker --version
   docker run hello-world
   ```

**Documentation:** https://docs.docker.com/desktop/setup/install/windows-install/

#### macOS

1. **Download Docker Desktop for Mac:**

   - Go to: https://docs.docker.com/desktop/setup/install/mac-install/
   - Choose your processor:
     - Apple Silicon (M1/M2/M3/M4): ARM64 version
     - Intel: Intel Chip version

2. **Install Docker Desktop:**

   - Open the downloaded `.dmg` file
   - Drag Docker.app to Applications folder
   - Open Applications → Docker.app
   - Enter your Mac password when prompted

3. **Start Docker Desktop:**

   - Click Docker icon in menu bar (top-right)
   - Wait for "Docker is running" message

4. **Verify Installation:**
   ```bash
   docker --version
   docker run hello-world
   ```

**Documentation:** https://docs.docker.com/desktop/setup/install/mac-install/

#### Linux

1. **Install Docker Engine (Official Method):**

   - Go to: https://docs.docker.com/engine/install/
   - Choose your Linux distribution:
     - Ubuntu/Debian
     - CentOS/RHEL
     - Fedora
     - Arch

   **Ubuntu/Debian Example:**

   ```bash
   # Add Docker's official GPG key
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

   # Add Docker repository
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

   # Install Docker
   sudo apt-get update
   sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
   ```

2. **Start Docker Service:**

   ```bash
   # Start Docker daemon
   sudo systemctl start docker

   # Enable Docker to start on boot
   sudo systemctl enable docker
   ```

3. **Run without sudo (Optional):**

   ```bash
   # Add current user to docker group
   sudo usermod -aG docker $USER
   newgrp docker
   ```

4. **Verify Installation:**
   ```bash
   docker --version
   docker run hello-world
   ```

**Documentation:** https://docs.docker.com/engine/install/

### Production Deployment

#### Option 1: Docker Run (Quick Start)

```bash
# Build the production image
docker build -t json-tree-viewer:latest .

# Run the container
docker run -d \
  --name json-tree-viewer \
  -p 8080:80 \
  --restart unless-stopped \
  json-tree-viewer:latest

# Access the application
# Open browser: http://localhost:8080
```

#### Option 2: Docker Compose (Recommended)

```bash
# Build and start the service
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the service
docker-compose down

# Rebuild after code changes
docker-compose up -d --build
```

**Production Features:**

- Automatic container restart on failure
- Health check endpoint at `/health`
- Gzip compression enabled
- Static asset caching (1 year)
- Security headers configured
- SPA routing support (Vue Router)

### Development with Docker

For development with hot module replacement:

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# Application available at http://localhost:5173
# Code changes auto-reload

# Stop development environment
docker-compose -f docker-compose.dev.yml down
```

**Development Features:**

- Volume mounting for instant code updates
- Preserved node_modules in container
- Full Vite HMR support
- DevTools access

### Docker Architecture

#### Multi-Stage Build Process

**Stage 1: Builder**

```
node:20-alpine → Install dependencies → Build application → Output to /dist
```

**Stage 2: Production**

```
nginx:1.25-alpine → Copy nginx.conf → Copy /dist → Optimized runtime image
```

**Image Sizes:**

- Production image (Dockerfile): ~97MB
- Development image (Dockerfile.dev): ~400MB

#### File Structure

```
├── Dockerfile              # Production multi-stage build
├── Dockerfile.dev          # Development with HMR
├── docker-compose.yml      # Production orchestration
├── docker-compose.dev.yml  # Development orchestration
├── nginx.conf              # Nginx configuration
├── .dockerignore           # Exclude files from build context
└── .env.example            # Environment variables template
```

### Configuration Details

#### Nginx Configuration Highlights

```nginx
# Gzip compression
gzip on;
gzip_comp_level 6;
gzip_types text/css application/javascript ...;

# Static asset caching
location ~* \.(css|js|jpg|png|svg|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Vue Router SPA fallback
location / {
    try_files $uri $uri/ /index.html;
}

# Security headers
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header Content-Security-Policy "...";
```

#### Health Check

The container includes a health check endpoint:

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' json-tree-viewer

# Manual health check
curl http://localhost:8080/health
# Response: healthy
```

### Advanced Docker Commands

```bash
# View container logs
docker logs -f json-tree-viewer

# Execute commands in container
docker exec -it json-tree-viewer sh

# Inspect container
docker inspect json-tree-viewer

# View container stats
docker stats json-tree-viewer

# Remove everything (containers, images, volumes)
docker-compose down -v --rmi all
```

### Production Deployment Platforms

#### Docker Hub

```bash
# Tag for Docker Hub
docker tag json-tree-viewer:latest username/json-tree-viewer:1.0.0

# Push to Docker Hub
docker push username/json-tree-viewer:1.0.0

# Pull and run on server
docker pull username/json-tree-viewer:1.0.0
docker run -d -p 80:80 username/json-tree-viewer:1.0.0
```

#### AWS ECS

```bash
# Tag for ECR
docker tag json-tree-viewer:latest \
  123456789012.dkr.ecr.us-east-1.amazonaws.com/json-tree-viewer:latest

# Push to ECR
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/json-tree-viewer:latest

# Deploy via ECS task definition
```

#### Kubernetes

```bash
# Create deployment
kubectl create deployment json-tree-viewer \
  --image=username/json-tree-viewer:latest

# Expose service
kubectl expose deployment json-tree-viewer \
  --type=LoadBalancer --port=80

# Scale replicas
kubectl scale deployment json-tree-viewer --replicas=3
```

#### Google Cloud Run

```bash
# Build for Cloud Run
docker build -t gcr.io/project-id/json-tree-viewer .

# Push to GCR
docker push gcr.io/project-id/json-tree-viewer

# Deploy
gcloud run deploy json-tree-viewer \
  --image gcr.io/project-id/json-tree-viewer \
  --platform managed \
  --allow-unauthenticated
```

### Environment Variables

```bash
# Create .env file from template
cp .env.example .env

# Edit environment variables
# NODE_ENV=production
# VITE_API_URL=https://api.example.com

# Run with custom env file
docker run --env-file .env -p 8080:80 json-tree-viewer
```

### Troubleshooting

#### Container won't start

```bash
# Check container logs
docker logs json-tree-viewer

# Inspect exit code
docker inspect json-tree-viewer --format='{{.State.ExitCode}}'

# Verify image
docker images | grep json-tree-viewer
```

#### Port already in use

```bash
# Find process using port 8080
# Linux/Mac:
lsof -i :8080

# Windows:
netstat -ano | findstr :8080

# Use different port
docker run -p 9090:80 json-tree-viewer
```

#### Build fails

```bash
# Clear Docker cache
docker builder prune -a

# Build with no cache
docker build --no-cache -t json-tree-viewer .

# Check disk space
docker system df
```

### Performance Optimization

**Build Time Optimization:**

- Layer caching (package.json copied first)
- npm ci for reproducible installs
- Multi-stage build to discard dev dependencies

**Runtime Optimization:**

- Alpine Linux base (minimal footprint)
- Gzip compression enabled
- Static asset caching headers
- HTTP/2 support via Nginx

**Security Best Practices:**

- Non-root user in container
- Security headers configured
- Regular base image updates
- Minimal attack surface

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

### JSON Tree Viewer - Dual License

This project is released under a **custom dual-license model** designed to support both open-source development and commercial use:

#### Free & Open-Source License (Dev & Local Use)

```
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to use,
copy, modify, and distribute the Software for:

✅ Personal development and learning purposes
✅ Local/internal use within organizations
✅ Educational institutions and non-profit organizations
✅ Open-source community projects

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

#### Commercial/Production License

For **production-grade deployments** (cloud hosting, SaaS, commercial applications,
or revenue-generating services), you must obtain explicit written permission from
the copyright holder.

**Unauthorized production use is prohibited.**

#### Terms & Conditions

- **Development Use**: Fully unrestricted for non-production environments
- **Production Use**: Requires commercial license agreement
- **Attribution**: Credit to original author is appreciated but not mandatory for dev use
- **Modifications**: You may modify the code for personal/local use
- **Distribution**: For dev/local use only without commercial license
- **Warranty**: Provided "AS IS" without any warranty
- **Liability**: Author not liable for any damages

#### How to Request Production License

For commercial use, cloud deployment, or revenue-generating applications:

1. Email: `asif.cse.contact@gmail.com` with subject: **"Production License Request - JSON Tree Viewer"**
2. Include:
   - Company/Organization name
   - Use case description
   - Deployment environment (cloud provider, scale, etc.)
   - Expected launch timeline
3. License will be provided within 5-7 business days

#### License File

Create a `LICENSE` file in your project root to include this license text.

---

## 🤝 Contributing

Thank you for your interest in contributing to JSON Tree Viewer! This project thrives
on community contributions.

### Ways to Contribute

#### 1. **Report Bugs**

- Use GitHub Issues to report bugs
- Include reproduction steps
- Provide environment details (OS, browser, Node version)

**Example Bug Report:**

```
Title: Tree node selection not working on deeply nested items
Description: When selecting nodes nested 5+ levels deep, the selection
doesn't highlight properly on screens with 1024px width.
Steps to Reproduce:
1. Import complex JSON with 5+ nested levels
2. Click on a deeply nested node
3. Observe: Selection background doesn't show fully
Expected: Full width selection highlight
```

#### 2. **Suggest Features**

- Open a GitHub Issue with label `enhancement`
- Describe the use case and expected behavior
- Include mockups or examples if applicable

**Example Feature Request:**

```
Title: Add copy-to-clipboard functionality
Description: Users should be able to copy individual node values or
entire subtrees to clipboard for easy sharing.
Use Case: Debugging API responses quickly
```

#### 3. **Submit Pull Requests**

**Branch Naming Convention:**

```
feature/feature-name           # New features
bugfix/bug-description         # Bug fixes
docs/documentation-update      # Documentation
refactor/code-improvement      # Code refactoring
chore/dependency-update        # Dependencies
```

**Before Submitting PR:**

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes with clear commit messages
4. Test thoroughly locally
5. Update documentation if needed
6. Ensure no console errors or warnings

**PR Template:**

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Testing

How was this tested?

## Checklist

- [ ] Code follows project style
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] No breaking changes
```

#### 4. **Improve Documentation**

- Fix typos or unclear explanations
- Add examples
- Improve README sections
- Create tutorials or guides

#### 5. **Code Review**

- Review open PRs
- Suggest improvements
- Test on your local environment
- Provide constructive feedback

### Development Guidelines

#### Code Style

- Use Vue 3 Composition API
- Use scoped styles in components
- Follow existing naming conventions
- Write self-documenting code with comments

#### Commit Messages

```
✨ feat: Add node search functionality
🐛 fix: Resolve drag-drop on nested nodes
📝 docs: Update installation guide
♻️  refactor: Simplify tree rendering logic
🧪 test: Add unit tests for undo feature
🎨 style: Update color scheme to match brand
⬆️  chore: Update Vue to latest version
```

#### Testing

- Test in multiple browsers (Chrome, Firefox, Safari, Edge)
- Test on different screen sizes (mobile, tablet, desktop)
- Test with complex JSON structures
- Verify no console errors

#### Performance

- Monitor bundle size with `npm run build`
- Use Vue DevTools to check unnecessary re-renders
- Profile with browser DevTools
- Aim for <100ms interaction response time

### Getting Help

- **Questions**: Open an Issue with label `question`
- **Discussion**: Use GitHub Discussions
- **Chat**: Email maintainer for urgent matters

### Code of Conduct

Contributors must:

- Be respectful and inclusive
- Provide constructive feedback
- Accept criticism gracefully
- Follow project guidelines
- Report violations to maintainer

### Recognition

Contributors will be:

- Mentioned in CHANGELOG for significant contributions
- Added to CONTRIBUTORS.md file
- Credited in release notes
- Featured in README (optional)

### Development Setup

```bash
# Fork and clone
git clone https://github.com/your-username/json-tree-viewer.git

# Install dependencies
npm install

# Create feature branch
git checkout -b feature/your-feature

# Start development
npm run dev

# Make changes and test
# Commit with conventional messages
git commit -m "feat: description"

# Push to your fork
git push origin feature/your-feature

# Open Pull Request on GitHub
```

### Questions Before Contributing?

Email: `asif.cse.contact@gmail.com` with subject: **"Contribution Inquiry"**

We're happy to help and guide you through the contribution process!

---

## 📧 Contact

### Developer

**Name:** Asif (Asif CSE KUET)

**Email:** [asif.cse.contact@gmail.com](mailto:asif.cse.contact@gmail.com)

### Inquiry Types

**For Production License:**

```
Subject: Production License Request - JSON Tree Viewer
Email: asif.cse.contact@gmail.com
```

**For Bug Reports:**

```
Use GitHub Issues with [BUG] label
Fallback: asif.cse.contact@gmail.com with subject "Bug Report"
```

**For Feature Requests:**

```
Use GitHub Issues with [FEATURE] label
Fallback: asif.cse.contact@gmail.com with subject "Feature Suggestion"
```

**For Collaboration/Partnership:**

```
Email: asif.cse.contact@gmail.com
Subject: Partnership Proposal - JSON Tree Viewer
```

**For Urgent Issues:**

```
Email: asif.cse.contact@gmail.com
Subject: URGENT - [Issue Description]
Response time: 24-48 hours
```

### Response Time

- **GitHub Issues**: 24-48 hours
- **Email Inquiries**: 24-48 hours
- **Urgent Matters**: 12 hours (marked URGENT)
- **License Requests**: 5-7 business days

### Social & Links

- **Repository**: [GitHub - JSON Tree Viewer](https://github.com/asif-cse-kuet/tree-explorer)
- **Developer Portfolio**: [Coming Soon]
- **LinkedIn**: [Add your LinkedIn URL if desired]

---

## 📄 Additional Notes

### Project History

This project was created to provide a production-grade JSON visualization and manipulation tool
with an intuitive UI, comprehensive features, and excellent developer experience.

### Acknowledgments

- Built with [Vue.js](https://vuejs.org/)
- State management with [Pinia](https://pinia.vuejs.org/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Build tool [Vite](https://vite.dev/)
- Inspiration from JSON tree visualizers across the web

---

**Made by Asif Hasan Tonmoy**
