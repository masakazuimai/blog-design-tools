// Excel templates (English). Labels must match excel.en.js exactly.

export const TEMPLATES = [
  {
    id: "staples",
    name: "Essentials",
    desc: "Used in every workflow",
    items: [
      { cat: "basic", label: "Copy" },
      { cat: "basic", label: "Paste" },
      { cat: "basic", label: "Undo" },
      { cat: "basic", label: "Save" },
      { cat: "basic", label: "Edit cell" },
      { cat: "format", label: "Format cells" },
      { cat: "format", label: "Bold" },
      { cat: "basic", label: "Find" },
      { cat: "move", label: "Go to first cell (A1)" },
    ],
  },
  {
    id: "table",
    name: "Tables & formatting",
    desc: "Borders, formats, tables",
    items: [
      { cat: "format", label: "Format cells" },
      { cat: "format", label: "Add outline border" },
      { cat: "format", label: "Comma style" },
      { cat: "format", label: "Currency format" },
      { cat: "format", label: "Bold" },
      { cat: "rowcol", label: "Insert cells / rows / columns" },
      { cat: "formula", label: "Create table" },
    ],
  },
  {
    id: "data",
    name: "Data analysis",
    desc: "Filters, refs, charts",
    items: [
      { cat: "formula", label: "Toggle filter" },
      { cat: "formula", label: "Create table" },
      { cat: "formula", label: "Toggle absolute / relative reference" },
      { cat: "move", label: "Move to bottom edge of data" },
      { cat: "move", label: "Select to bottom edge" },
      { cat: "formula", label: "Create chart (same sheet)" },
    ],
  },
  {
    id: "input",
    name: "Faster input",
    desc: "Fast entry, dates, fill",
    items: [
      { cat: "basic", label: "Edit cell" },
      { cat: "basic", label: "Fill selection at once" },
      { cat: "basic", label: "New line in cell" },
      { cat: "basic", label: "Insert today's date" },
      { cat: "basic", label: "Fill down" },
      { cat: "basic", label: "Fill right" },
    ],
  },
];
