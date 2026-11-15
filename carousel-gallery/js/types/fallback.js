export const viewFallback = (list, apply) => `if (!CSS.supports("animation-timeline: view()")) {
  const list = document.querySelector("${list}");
  const update = () => {
    const box = list.getBoundingClientRect();
    const mid = box.left + box.width / 2;
    [...list.children].forEach((card) => {
      const r = card.getBoundingClientRect();
      const s = Math.max(-1, Math.min(1, (r.left + r.width / 2 - mid) / (box.width / 2)));
      const t = Math.abs(s);
      ${apply}
    });
  };
  list.addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update);
  update();
}`;
