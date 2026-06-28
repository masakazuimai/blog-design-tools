// Notion templates (English). label must match data/notion.en.js exactly.

export const TEMPLATES = [
  {
    id: "staples",
    name: "Staples",
    desc: "Everyday basics",
    items: [
      { cat: "general", label: "New page (desktop)" },
      { cat: "general", label: "Search / Quick Find" },
      { cat: "blocks", label: "Command menu (slash)" },
      { cat: "format", label: "Bold" },
      { cat: "format", label: "Add link" },
      { cat: "edit", label: "Duplicate block" },
    ],
  },
  {
    id: "blocks",
    name: "Blocks",
    desc: "Reorder & indent",
    items: [
      { cat: "blocks", label: "Command menu (slash)" },
      { cat: "blocks", label: "Edit block (action menu)" },
      { cat: "blocks", label: "Move block up" },
      { cat: "blocks", label: "Move block down" },
      { cat: "blocks", label: "Indent" },
      { cat: "blocks", label: "Outdent" },
      { cat: "edit", label: "Duplicate block" },
    ],
  },
  {
    id: "format",
    name: "Text formatting",
    desc: "Styles, code, links",
    items: [
      { cat: "format", label: "Bold" },
      { cat: "format", label: "Italic" },
      { cat: "format", label: "Underline" },
      { cat: "format", label: "Strikethrough" },
      { cat: "format", label: "Inline code" },
      { cat: "format", label: "Add link" },
      { cat: "format", label: "Highlight (last color)" },
    ],
  },
  {
    id: "navigation",
    name: "Page navigation",
    desc: "Search & moving around",
    items: [
      { cat: "general", label: "Search / Quick Find" },
      { cat: "general", label: "Go back" },
      { cat: "general", label: "Go forward" },
      { cat: "general", label: "Go to parent page" },
      { cat: "general", label: "Toggle sidebar" },
      { cat: "general", label: "Toggle dark mode" },
      { cat: "general", label: "New page (desktop)" },
    ],
  },
];
