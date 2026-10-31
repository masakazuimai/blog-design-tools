
import { t } from "./i18n.js?v=20260815c";

export function downloadBlob(blob, filename) {
  if (!blob) throw new Error(t("buildFailed"));

  const url = URL.createObjectURL(new Blob([blob], { type: "application/octet-stream" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();

  setTimeout(() => {
    anchor.remove();
    URL.revokeObjectURL(url);
  }, 1000);
}

export function downloadText(text, filename) {
  downloadBlob(new Blob([text]), filename);
}
