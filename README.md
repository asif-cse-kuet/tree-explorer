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

### Overview

The application includes production-grade Docker configuration with:

- **Multi-stage builds** for optimized image size (~25MB final image)
- **Nginx** as production web server
- **Security headers** and best practices
- **Health checks** for container orchestration
- **Development mode** with hot reload support

### Prerequisites

- **Docker**: v20.10+
- **Docker Compose**: v2.0+ (included with Docker Desktop)

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

- Builder stage: ~500MB (discarded)
- Final image: ~25MB (nginx + static assets)

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

### Project Stats

- **Lines of Code**: 1000+
- **Components**: 8+ Vue components
- **Features**: 15+ major features
- **Build Size**: ~25MB (Docker)
- **Bundle Size**: ~50KB (gzipped)

---

**Made with ❤️ by Asif Hasan Tonmoy**
