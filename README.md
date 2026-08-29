# Tree Explorer

An interactive JSON tree viewer and editor built with Vue 3, Pinia, and Tailwind CSS. Import JSON, explore it as a collapsible tree, edit nodes inline, drag-and-drop to reorganize, and undo recent changes.

## Features

- Import JSON from a dialog with validation and error feedback
- Collapsible tree navigation with breadcrumb paths
- Add, rename, and delete nodes (root node is protected)
- Drag-and-drop re-parenting with visual drop zones
- Undo for add, delete, and rename operations
- LocalStorage persistence for tree data and selection
- Responsive two-panel layout (tree + formatted JSON view)

## Tech Stack

| Layer | Choice |
| --- | --- |
| UI | Vue 3 (Composition API, Single File Components) |
| State | Pinia + pinia-plugin-persistedstate |
| Styling | Tailwind CSS 4 |
| Build | Vite 7 |
| Tests | Vitest + jsdom |

This project uses JavaScript only. There is no vue-router, no TypeScript, and no backend server.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install and run

```bash
git clone https://github.com/asif-cse-kuet/tree-explorer.git
cd tree-explorer
npm install
npm run dev
```

Open `http://localhost:5173`.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm test` | Run Vitest unit tests |

## Usage

1. Click **Import** and paste a JSON object or array.
2. Expand nodes with the caret, click a node to select it.
3. Use **+** to add a child, **-** to delete (with confirmation), or double-click to rename.
4. Drag nodes to reorder or re-parent them.
5. Use the undo button to revert the last add/delete/rename.
6. Use **Re-import** or **Clear data** when a tree is loaded.

## Project Structure

```
tree-explorer/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Global styles
│   ├── global/             # Shared components (Breadcrumb, dialogs)
│   ├── module/
│   │   ├── components/     # Tree, Json, TreeNode, drag handler
│   │   └── pages/          # IndexPage
│   ├── stores/
│   │   └── treeStore/      # Pinia store, actions, utilities
│   ├── App.vue
│   └── main.js
├── docs/                   # Architecture and screenshot notes
├── index.html
├── vite.config.js
├── vitest.config.js
└── package.json
```

## Docker (optional)

Production and development Docker configs are included for containerized runs.

```bash
# Development with HMR
docker compose -f docker-compose.dev.yml up

# Production (nginx on port 8080)
docker compose up -d
```

See `Dockerfile`, `Dockerfile.dev`, and `docker-compose*.yml` for details.

## Security Notes

- JSON imports are limited to 5 MB.
- Parsed data is sanitized to strip `__proto__`, `constructor`, and `prototype` keys.
- Drag-and-drop blocks moves that would create descendant cycles.

## Testing

```bash
npm test
```

Store action tests cover JSON import, delete, rename, move, undo, payload limits, and prototype sanitization.

## Documentation

- [Architecture overview](docs/ARCHITECTURE.md)
- [Screenshot checklist](docs/SCREENSHOTS.md)

## Browser Support

Modern evergreen browsers with ES modules, LocalStorage, and HTML5 drag-and-drop support (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+).

## License

[MIT](LICENSE)

## Author

Asif Hasan Tonmoy — [asif.cse.contact@gmail.com](mailto:asif.cse.contact@gmail.com)

Repository: [github.com/asif-cse-kuet/tree-explorer](https://github.com/asif-cse-kuet/tree-explorer)
