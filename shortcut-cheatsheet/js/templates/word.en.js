// Word templates (English). Labels must match word.en.js exactly.

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
      { cat: "font", label: "Bold" },
      { cat: "basic", label: "Find" },
      { cat: "basic", label: "Select all" },
      { cat: "basic", label: "Print" },
    ],
  },
  {
    id: "decorate",
    name: "Text styling",
    desc: "Bold, size, format copy",
    items: [
      { cat: "font", label: "Bold" },
      { cat: "font", label: "Italic" },
      { cat: "font", label: "Underline" },
      { cat: "font", label: "Increase font size" },
      { cat: "font", label: "Copy formatting" },
      { cat: "font", label: "Paste formatting" },
      { cat: "font", label: "Clear formatting" },
      { cat: "font", label: "Change case" },
    ],
  },
  {
    id: "layout",
    name: "Layout & paragraphs",
    desc: "Align, indent, page break",
    items: [
      { cat: "paragraph", label: "Align left" },
      { cat: "paragraph", label: "Align center" },
      { cat: "paragraph", label: "Align right" },
      { cat: "paragraph", label: "Justify" },
      { cat: "paragraph", label: "Increase indent" },
      { cat: "insert", label: "Page break" },
      { cat: "style", label: "Heading 1" },
    ],
  },
  {
    id: "writing",
    name: "Writing",
    desc: "Headings, links, proofing",
    items: [
      { cat: "insert", label: "Insert hyperlink" },
      { cat: "insert", label: "Spelling & grammar" },
      { cat: "insert", label: "Page break" },
      { cat: "style", label: "Heading 1" },
      { cat: "style", label: "Heading 2" },
      { cat: "style", label: "Bulleted list" },
    ],
  },
];
