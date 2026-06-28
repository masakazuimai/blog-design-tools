// PowerPoint templates (English). Labels must match powerpoint.en.js exactly.

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
      { cat: "basic", label: "Duplicate object / slide" },
      { cat: "slide", label: "New slide" },
      { cat: "font", label: "Bold" },
      { cat: "show", label: "Start slide show from beginning" },
    ],
  },
  {
    id: "create",
    name: "Building slides",
    desc: "Add slides, text, duplicate",
    items: [
      { cat: "slide", label: "New slide" },
      { cat: "slide", label: "Duplicate slide" },
      { cat: "basic", label: "Duplicate object / slide" },
      { cat: "font", label: "Bold" },
      { cat: "font", label: "Increase font size" },
      { cat: "paragraph", label: "Align center" },
      { cat: "object", label: "Group" },
    ],
  },
  {
    id: "shapes",
    name: "Shapes & layout",
    desc: "Group, align, duplicate",
    items: [
      { cat: "object", label: "Group" },
      { cat: "object", label: "Ungroup" },
      { cat: "basic", label: "Duplicate object / slide" },
      { cat: "paragraph", label: "Align left" },
      { cat: "paragraph", label: "Align center" },
      { cat: "paragraph", label: "Align right" },
    ],
  },
  {
    id: "present",
    name: "Presenting",
    desc: "Start, navigate, blank",
    items: [
      { cat: "show", label: "Start slide show from beginning" },
      { cat: "show", label: "Start from current slide" },
      { cat: "show", label: "Next slide" },
      { cat: "show", label: "Previous slide" },
      { cat: "show", label: "Black screen" },
      { cat: "show", label: "End slide show" },
    ],
  },
];
