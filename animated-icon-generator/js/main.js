
import { ICONS, CATEGORIES, CATEGORY_LABELS } from "./icons/index.js?v=20260815c";
import { buildKeyframes, buildRules } from "./anim.js?v=20260815c";
import { createIconSvg, buildSvgFile } from "./svg.js?v=20260815c";
import { renderPng } from "./raster.js?v=20260815c";
import { downloadBlob, downloadText } from "./download.js?v=20260815c";
import { LANG, t } from "./i18n.js?v=20260815c";

const STORAGE_KEY = "aig:v1";
const DEFAULTS = { color: "#6366f1", size: 128, speed: 1, loop: "infinite" };

const GALLERY_LOOP = 3;

const label = (labels) => labels[LANG] || labels.ja;

const el = (id) => document.getElementById(id);
const dom = {
  titleIcon: el("titleIcon"),
  filters: el("filters"),
  grid: el("grid"),
  countNote: el("countNote"),
  search: el("search"),
  playAll: el("playAll"),
  preview: el("preview"),
  previewName: el("previewName"),
  replay: el("replay"),
  color: el("iconColor"),
  colorVal: el("colorVal"),
  size: el("sizeSel"),
  speed: el("speedSel"),
  loop: el("loopSel"),
  reset: el("resetSettings"),
  toast: el("toast"),
};

let settings = { ...DEFAULTS };
let activeCat = "all";
let query = "";
let selected = ICONS[0];

const keyframeStyle = document.createElement("style");
const ruleStyle = document.createElement("style");
const titleStyle = document.createElement("style");
document.head.append(keyframeStyle, ruleStyle, titleStyle);


function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    settings = { ...DEFAULTS, ...saved };
  } catch (error) {
    console.error("設定の読み込みに失敗しました:", error);
    settings = { ...DEFAULTS };
  }
}

function saveSettings() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("設定の保存に失敗しました:", error);
  }
}

function applySettings() {
  document.documentElement.style.setProperty("--icon-color", settings.color);
  dom.color.value = settings.color;
  dom.colorVal.textContent = settings.color;
  dom.size.value = String(settings.size);
  dom.speed.value = String(settings.speed);
  dom.loop.value = settings.loop;

  ruleStyle.textContent = ICONS.map((icon) =>
    [
      buildRules(icon, { speed: settings.speed, loop: GALLERY_LOOP, scope: `.card.icon-${icon.id}.is-playing ` }),
      buildRules(icon, { speed: settings.speed, loop: settings.loop, scope: `#preview.icon-${icon.id}.is-playing ` }),
    ].join("\n")
  ).join("\n");
}


function play(target) {
  target.classList.remove("is-playing");
  void target.offsetWidth;
  target.classList.add("is-playing");
}


function visibleIcons() {
  const keyword = query.trim().toLowerCase();
  return ICONS.filter((icon) => {
    if (activeCat !== "all" && icon.cat !== activeCat) return false;
    if (!keyword) return true;
    return `${icon.id} ${icon.label.ja} ${icon.label.en}`.toLowerCase().includes(keyword);
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) play(entry.target);
    });
  },
  { threshold: 0.4 }
);

function renderFilters() {
  const chips = [{ key: "all", text: t("all") }].concat(
    CATEGORIES.map((cat) => ({ key: cat, text: label(CATEGORY_LABELS[cat]) }))
  );

  dom.filters.replaceChildren(
    ...chips.map(({ key, text }) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = `chip${key === activeCat ? " is-active" : ""}`;
      chip.textContent = text;
      chip.addEventListener("click", () => {
        activeCat = key;
        renderFilters();
        renderGrid();
      });
      return chip;
    })
  );
}

function renderGrid() {
  observer.disconnect();
  const icons = visibleIcons();

  dom.grid.replaceChildren(
    ...icons.map((icon) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = `card icon-${icon.id}${icon === selected ? " is-selected" : ""}`;
      card.dataset.id = icon.id;

      const box = document.createElement("span");
      box.className = "card-icon";
      box.appendChild(createIconSvg(icon));

      const name = document.createElement("span");
      name.className = "card-label";
      name.textContent = label(icon.label);

      card.append(box, name);
      card.addEventListener("click", () => selectIcon(icon));
      card.addEventListener("mouseenter", () => play(card));
      return card;
    })
  );

  dom.grid.querySelectorAll(".card").forEach((card) => observer.observe(card));

  dom.countNote.textContent = t("count", icons.length, ICONS.length);
}


function selectIcon(icon) {
  selected = icon;
  dom.grid.querySelectorAll(".card").forEach((card) => {
    card.classList.toggle("is-selected", card.dataset.id === icon.id);
  });

  dom.preview.className = `preview icon-${icon.id}`;
  dom.preview.replaceChildren(createIconSvg(icon));
  dom.previewName.textContent = label(icon.label);
  play(dom.preview);
}


function svgOptions(animated) {
  return {
    size: settings.size,
    color: settings.color,
    animated,
    speed: settings.speed,
    loop: settings.loop,
  };
}

function showToast(message) {
  dom.toast.textContent = message;
  dom.toast.classList.add("is-visible");
  setTimeout(() => dom.toast.classList.remove("is-visible"), 2200);
}

async function handleDownload(kind) {
  try {
    if (kind === "png") {
      const blob = await renderPng(buildSvgFile(selected, svgOptions(false)), settings.size);
      downloadBlob(blob, `${selected.id}-${settings.size}.png`);
    } else {
      const animated = kind === "animated";
      downloadText(
        buildSvgFile(selected, svgOptions(animated)),
        animated ? `${selected.id}-animated.svg` : `${selected.id}.svg`
      );
    }
    showToast(t("downloaded"));
  } catch (error) {
    console.error("ダウンロードに失敗しました:", error);
    showToast(error.message);
  }
}


function bindEvents() {
  dom.search.addEventListener("input", (event) => {
    query = event.target.value;
    renderGrid();
  });

  dom.playAll.addEventListener("click", () => {
    dom.grid.querySelectorAll(".card").forEach((card) => play(card));
  });

  dom.replay.addEventListener("click", () => play(dom.preview));

  dom.grid.addEventListener("animationend", (event) => {
    const card = event.target.closest(".card");
    if (card) card.classList.remove("is-playing");
  });
  dom.preview.addEventListener("animationend", () => {
    dom.preview.classList.remove("is-playing");
  });

  dom.color.addEventListener("input", (event) => {
    settings.color = event.target.value;
    applySettings();
    saveSettings();
  });

  [
    [dom.size, "size", Number],
    [dom.speed, "speed", Number],
    [dom.loop, "loop", String],
  ].forEach(([input, key, cast]) => {
    input.addEventListener("change", (event) => {
      settings[key] = cast(event.target.value);
      applySettings();
      saveSettings();
      play(dom.preview);
    });
  });

  dom.reset.addEventListener("click", () => {
    settings = { ...DEFAULTS };
    applySettings();
    saveSettings();
    play(dom.preview);
  });

  [
    ["dlAnimSvg", "animated"],
    ["dlStaticSvg", "static"],
    ["dlPng", "png"],
  ].forEach(([id, kind]) => {
    el(id).addEventListener("click", () => handleDownload(kind));
  });
}

function setupTitleIcon() {
  const icon = ICONS.find((item) => item.id === "check");
  if (!icon || !dom.titleIcon) return;

  titleStyle.textContent = buildRules(icon, { speed: 1, loop: 1, scope: ".title-icon.is-playing " });
  dom.titleIcon.replaceChildren(createIconSvg(icon));
  play(dom.titleIcon);
}

keyframeStyle.textContent = ICONS.map(buildKeyframes).join("\n");
setupTitleIcon();
loadSettings();
applySettings();
renderFilters();
renderGrid();
selectIcon(selected);
bindEvents();
