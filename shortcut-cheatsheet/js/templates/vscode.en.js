// VS Code templates (English). label must match data/vscode.en.js exactly.

export const TEMPLATES = [
  {
    id: "staples",
    name: "Staples",
    desc: "Everyday basics",
    items: [
      { cat: "general", label: "Show Command Palette" },
      { cat: "general", label: "Go to File (Quick Open)" },
      { cat: "general", label: "Toggle sidebar" },
      { cat: "file", label: "Save" },
      { cat: "search", label: "Find" },
      { cat: "editing", label: "Toggle line comment" },
      { cat: "editing", label: "Format document" },
    ],
  },
  {
    id: "fastedit",
    name: "Fast editing",
    desc: "Line operations",
    items: [
      { cat: "editing", label: "Move line down" },
      { cat: "editing", label: "Move line up" },
      { cat: "editing", label: "Copy line down" },
      { cat: "editing", label: "Delete line" },
      { cat: "editing", label: "Toggle line comment" },
      { cat: "editing", label: "Format document" },
    ],
  },
  {
    id: "multicursor",
    name: "Multi-cursor",
    desc: "Multiple selections",
    items: [
      { cat: "cursor", label: "Insert cursor" },
      { cat: "cursor", label: "Add cursor above" },
      { cat: "cursor", label: "Add cursor below" },
      { cat: "cursor", label: "Add next match to selection" },
      { cat: "cursor", label: "Select all occurrences" },
      { cat: "cursor", label: "Select current line" },
    ],
  },
  {
    id: "reading",
    name: "Reading code",
    desc: "Navigation & definitions",
    items: [
      { cat: "general", label: "Go to File (Quick Open)" },
      { cat: "navigation", label: "Go to Symbol in file" },
      { cat: "navigation", label: "Go to Definition" },
      { cat: "navigation", label: "Peek Definition" },
      { cat: "navigation", label: "Go to References" },
      { cat: "search", label: "Find in Files" },
    ],
  },
];
