// Slack shortcut data (English). Same keys as the JP file; labels translated.

export const CATEGORIES = [
  {
    id: "navigation",
    name: "Navigation",
    items: [
      { keys: ["mod", "K"], label: "Quick switcher (jump to)" },
      { keys: ["mod", "shift", "K"], label: "Open direct messages" },
      { keys: ["mod", "shift", "T"], label: "Open threads" },
      { keys: ["mod", "shift", "A"], label: "Open all unreads" },
      { keys: ["mod", "shift", "S"], label: "Open Later (saved items)" },
      { keys: ["mod", "["], label: "Go back" },
      { keys: ["mod", "]"], label: "Go forward" },
      { keys: ["alt", "↑"], label: "Previous channel" },
      { keys: ["alt", "↓"], label: "Next channel" },
      { keys: ["alt", "shift", "↑"], label: "Previous unread" },
      { keys: ["alt", "shift", "↓"], label: "Next unread" },
    ],
  },
  {
    id: "messaging",
    name: "Messaging",
    items: [
      { keys: ["Enter"], label: "Send message" },
      { keys: ["shift", "Enter"], label: "New line (don't send)" },
      { keys: ["↑"], label: "Edit your last message" },
      { keys: ["mod", "U"], label: "Upload a file" },
      { keys: ["mod", "shift", "Enter"], label: "Create a snippet" },
    ],
  },
  {
    id: "format",
    name: "Formatting",
    items: [
      { keys: ["mod", "B"], label: "Bold" },
      { keys: ["mod", "I"], label: "Italic" },
      { keys: ["mod", "shift", "X"], label: "Strikethrough" },
      { keys: ["mod", "shift", "C"], label: "Code (inline)" },
      { keys: ["mod", "alt", "shift", "C"], label: "Code block" },
      { keys: ["mod", "shift", "9"], label: "Quote" },
      { keys: ["mod", "shift", "8"], label: "Bulleted list" },
      { keys: ["mod", "shift", "7"], label: "Numbered list" },
    ],
  },
  {
    id: "read",
    name: "Read / Unread",
    items: [
      { keys: ["Esc"], label: "Mark current channel as read" },
      { keys: ["shift", "Esc"], label: "Mark all as read" },
    ],
  },
  {
    id: "misc",
    name: "Other",
    items: [
      { keys: ["mod", ","], label: "Open preferences" },
      { keys: ["mod", "/"], label: "Show keyboard shortcuts" },
      { keys: ["mod", "."], label: "Toggle right pane" },
    ],
  },
];
