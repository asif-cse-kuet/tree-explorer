# Screenshots

Placeholder checklist for documentation and release screenshots.

## Recommended Captures

1. **Empty state** — Import button on the left panel before any JSON is loaded.
2. **Loaded tree** — Sample JSON expanded in the tree with breadcrumb showing `Tree > …`.
3. **JSON panel** — Right panel showing pretty-printed JSON synced to selection.
4. **Inline rename** — Double-click edit mode on a node label.
5. **Add child** — Blue + button with inline name input.
6. **Delete confirm** — Confirmation dialog before node removal.
7. **Drag-and-drop** — Drop zone indicators (blue line / green inside highlight).
8. **Re-import / Clear** — Toolbar buttons visible when tree has data.
9. **Undo** — Undo button enabled after a mutating action.
10. **Import error** — Invalid JSON warning in the import dialog.

## Suggested Sample JSON

```json
{
  "users": {
    "admin": { "name": "John", "role": "Administrator" },
    "guest": { "name": "Jane" }
  },
  "settings": {
    "theme": "dark",
    "maxUsers": 50
  }
}
```

## File Naming

Store screenshots under `docs/screenshots/` using descriptive names, for example:

- `01-empty-state.png`
- `02-tree-loaded.png`
- `03-drag-drop-inside.png`

Replace this placeholder once screenshots are added to the repository.
