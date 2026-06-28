// Notion shortcut data (English). Same keys as the JP file; labels translated.

export const CATEGORIES = [
  {
    id: "general",
    name: "Basics",
    items: [
      { keys: ["mod", "N"], label: "New page (desktop)" },
      { keys: ["mod", "shift", "N"], label: "New window" },
      { keys: ["mod", "P"], label: "Search / Quick Find" },
      { keys: ["mod", "\\"], label: "Toggle sidebar" },
      { keys: ["mod", "["], label: "Go back" },
      { keys: ["mod", "]"], label: "Go forward" },
      { keys: ["mod", "shift", "U"], label: "Go to parent page" },
      { keys: ["mod", "shift", "L"], label: "Toggle dark mode" },
    ],
  },
  {
    id: "edit",
    name: "Editing",
    items: [
      { keys: ["mod", "Z"], label: "Undo" },
      { keys: ["mod", "shift", "Z"], label: "Redo" },
      { keys: ["mod", "X"], label: "Cut" },
      { keys: ["mod", "C"], label: "Copy" },
      { keys: ["mod", "V"], label: "Paste" },
      { keys: ["mod", "D"], label: "Duplicate block" },
      { keys: ["mod", "A"], label: "Select block (again for all)" },
    ],
  },
  {
    id: "blocks",
    name: "Blocks",
    items: [
      { keys: ["/"], label: "Command menu (slash)" },
      { keys: ["mod", "/"], label: "Edit block (action menu)" },
      { keys: ["mod", "shift", "↑"], label: "Move block up" },
      { keys: ["mod", "shift", "↓"], label: "Move block down" },
      { keys: ["Tab"], label: "Indent" },
      { keys: ["shift", "Tab"], label: "Outdent" },
      { keys: ["shift", "Enter"], label: "Line break within block" },
    ],
  },
  {
    id: "format",
    name: "Text formatting",
    items: [
      { keys: ["mod", "B"], label: "Bold" },
      { keys: ["mod", "I"], label: "Italic" },
      { keys: ["mod", "U"], label: "Underline" },
      { keys: ["mod", "shift", "S"], label: "Strikethrough" },
      { keys: ["mod", "E"], label: "Inline code" },
      { keys: ["mod", "K"], label: "Add link" },
      { keys: ["mod", "shift", "H"], label: "Highlight (last color)" },
    ],
  },
  {
    id: "misc",
    name: "Comments / Other",
    items: [
      { keys: ["mod", "shift", "M"], label: "Add comment" },
    ],
  },
];
