// Slack templates (English). label must match data/slack.en.js exactly.

export const TEMPLATES = [
  {
    id: "staples",
    name: "Staples",
    desc: "Everyday basics",
    items: [
      { cat: "navigation", label: "Quick switcher (jump to)" },
      { cat: "navigation", label: "Open direct messages" },
      { cat: "messaging", label: "Send message" },
      { cat: "messaging", label: "New line (don't send)" },
      { cat: "format", label: "Bold" },
      { cat: "read", label: "Mark all as read" },
    ],
  },
  {
    id: "navigation",
    name: "Fast navigation",
    desc: "Switching & unreads",
    items: [
      { cat: "navigation", label: "Quick switcher (jump to)" },
      { cat: "navigation", label: "Open direct messages" },
      { cat: "navigation", label: "Open threads" },
      { cat: "navigation", label: "Open all unreads" },
      { cat: "navigation", label: "Previous unread" },
      { cat: "navigation", label: "Next unread" },
      { cat: "navigation", label: "Previous channel" },
      { cat: "navigation", label: "Next channel" },
    ],
  },
  {
    id: "format",
    name: "Formatting",
    desc: "Styles, lists, code",
    items: [
      { cat: "format", label: "Bold" },
      { cat: "format", label: "Italic" },
      { cat: "format", label: "Strikethrough" },
      { cat: "format", label: "Code (inline)" },
      { cat: "format", label: "Code block" },
      { cat: "format", label: "Quote" },
      { cat: "format", label: "Bulleted list" },
      { cat: "format", label: "Numbered list" },
    ],
  },
  {
    id: "writing",
    name: "Writing",
    desc: "Send, edit, attach",
    items: [
      { cat: "messaging", label: "Send message" },
      { cat: "messaging", label: "New line (don't send)" },
      { cat: "messaging", label: "Edit your last message" },
      { cat: "messaging", label: "Upload a file" },
      { cat: "messaging", label: "Create a snippet" },
      { cat: "format", label: "Code block" },
    ],
  },
];
