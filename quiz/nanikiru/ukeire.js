import { track } from "../assets/store.js?v=20261109b";

const DECK_ID = "nanikiru-ukeire";
const STORE_KEY = "cq-quiz:" + DECK_ID + ":v1";
const KANJI = "一二三四五六七八九";
const SUIT = { m: "萬", p: "筒", s: "索" };
const HONOR = ["東", "南", "西", "北", "白", "發", "中"];
const SHANTEN = ["テンパイ", "イーシャンテン", "リャンシャンテン"];
const SPOTS = {
  1: [[50, 50]],
  2: [[50, 28], [50, 72]],
  3: [[28, 24], [50, 50], [72, 76]],
  4: [[31, 28], [69, 28], [31, 72], [69, 72]],
  5: [[29, 24], [71, 24], [50, 50], [29, 76], [71, 76]],
  6: [[31, 20], [69, 20], [31, 50], [69, 50], [31, 80], [69, 80]],
  7: [[26, 14], [50, 28], [74, 42], [31, 62], [69, 62], [31, 86], [69, 86]],
  8: [[31, 14], [69, 14], [31, 38], [69, 38], [31, 62], [69, 62], [31, 86], [69, 86]],
  9: [[24, 18], [50, 18], [76, 18], [24, 50], [50, 50], [76, 50], [24, 82], [50, 82], [76, 82]],
};

const problems = window.UKEIRE_PROBLEMS || [];
const $ = (sel) => document.querySelector(sel);

export function tileName(id) {
  const n = Number(id[0]);
  const s = id[1];
  return s === "z" ? HONOR[n - 1] : KANJI[n - 1] + SUIT[s];
}

export function drawTile(id, el) {
  const n = Number(id[0]);
  const s = id[1];
  const face = document.createElement("span");
  face.className = "tile__face tile__face--" + s;
  face.setAttribute("aria-hidden", "true");
  if (s === "m") {
    face.innerHTML = "<b>" + KANJI[n - 1] + "</b><i>萬</i>";
  } else if (s === "z") {
    face.innerHTML = "<b>" + HONOR[n - 1] + "</b>";
    face.dataset.honor = String(n);
  } else {
    SPOTS[n].forEach(([x, y]) => {
      const dot = document.createElement("span");
      dot.className = s === "p" ? "pin" : "sou";
      dot.style.left = x + "%";
      dot.style.top = y + "%";
      face.appendChild(dot);
    });
    face.dataset.n = String(n);
  }
  el.classList.add("tile");
  el.appendChild(face);
  return el;
}

function allTileIds() {
  const ids = [];
  "mps".split("").forEach((s) => {
    for (let n = 1; n <= 9; n += 1) ids.push(n + s);
  });
  for (let n = 1; n <= 7; n += 1) ids.push(n + "z");
  return ids;
}

function loadResults() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORE_KEY) || "{}");
    return parsed && typeof parsed.results === "object" && parsed.results ? parsed.results : {};
  } catch (error) {
    return {};
  }
}

function saveResults(results) {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify({ results }));
  } catch (error) {
    return;
  }
}

function setup() {
  if (!problems.length) return;
  const handEl = $("#hand");
  const pickerEl = $("#picker");
  const answerBtn = $("#answer-btn");
  const clearBtn = $("#clear-btn");
  const nextBtn = $("#next-btn");
  const feedback = $("#feedback");
  const stepsEl = $("#steps");
  const pickerButtons = new Map();

  let index = 0;
  let selected = new Set();
  let answered = false;
  let results = loadResults();
  let runOk = 0;
  let runDone = 0;

  stepsEl.innerHTML = problems
    .map((p) => '<li><button type="button" data-no="' + p.no + '" aria-label="第' + p.no + '問へ"></button></li>')
    .join("");

  allTileIds().forEach((id) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.tile = id;
    btn.setAttribute("aria-pressed", "false");
    btn.setAttribute("aria-label", tileName(id));
    drawTile(id, btn);
    const mark = document.createElement("span");
    mark.className = "tile__mark";
    mark.setAttribute("aria-hidden", "true");
    btn.appendChild(mark);
    btn.addEventListener("click", () => toggle(id));
    pickerEl.querySelector('[data-suit="' + id[1] + '"]').appendChild(btn);
    pickerButtons.set(id, btn);
  });

  function refreshSteps() {
    stepsEl.querySelectorAll("li").forEach((li, i) => {
      const r = results[problems[i].no];
      li.dataset.state = r === 1 ? "ok" : r === 0 ? "ng" : "";
      li.classList.toggle("is-current", i === index);
      const b = li.querySelector("button");
      if (i === index) b.setAttribute("aria-current", "step");
      else b.removeAttribute("aria-current");
    });
  }

  function refreshButtons() {
    answerBtn.disabled = answered || selected.size === 0;
    clearBtn.disabled = answered || selected.size === 0;
    $("#picked-count").textContent = selected.size ? selected.size + "種を選んでいます" : "まだ選んでいません";
  }

  function toggle(id) {
    if (answered) return;
    const btn = pickerButtons.get(id);
    if (selected.has(id)) selected.delete(id);
    else selected.add(id);
    btn.setAttribute("aria-pressed", selected.has(id) ? "true" : "false");
    refreshButtons();
  }

  function show(i) {
    index = i;
    const p = problems[i];
    selected = new Set();
    answered = false;
    $("#q-no").textContent = "第" + p.no + "問";
    $("#q-total").textContent = "／" + problems.length + "問";
    $("#q-level").textContent = SHANTEN[p.shanten];
    handEl.innerHTML = "";
    handEl.setAttribute("aria-label", "手牌13枚：" + p.hand.map(tileName).join("、"));
    p.hand.forEach((id) => {
      const t = document.createElement("span");
      handEl.appendChild(drawTile(id, t));
    });
    pickerButtons.forEach((btn, id) => {
      btn.setAttribute("aria-pressed", "false");
      btn.dataset.judge = "";
      btn.disabled = false;
      btn.setAttribute("aria-label", tileName(id));
    });
    feedback.hidden = true;
    nextBtn.hidden = true;
    $(".uk-actions").hidden = false;
    $("#result").hidden = true;
    $("#play").hidden = false;
    refreshSteps();
    refreshButtons();
  }

  function judge() {
    if (answered || selected.size === 0) return;
    answered = true;
    const p = problems[index];
    const answer = new Set(p.answer);
    let hit = 0;
    let miss = 0;
    let extra = 0;
    pickerButtons.forEach((btn, id) => {
      const inAnswer = answer.has(id);
      const picked = selected.has(id);
      let state = "";
      let label = tileName(id);
      if (inAnswer && picked) { state = "hit"; hit += 1; label += "：正しく選んだ受け入れ"; }
      else if (inAnswer) { state = "miss"; miss += 1; label += "：選び漏れた受け入れ"; }
      else if (picked) { state = "extra"; extra += 1; label += "：受け入れではない"; }
      btn.dataset.judge = state;
      btn.disabled = true;
      btn.setAttribute("aria-label", label);
    });
    const ok = miss === 0 && extra === 0;
    results = { ...results, [p.no]: ok ? 1 : 0 };
    saveResults(results);
    runDone += 1;
    if (ok) runOk += 1;
    track("quiz_answer", { deck_id: DECK_ID, question_id: DECK_ID + "-" + String(p.no).padStart(3, "0"), is_correct: ok, quiz_mode: "all" });

    $("#fb-verdict").textContent = ok ? "正解" : "おしい";
    feedback.dataset.ok = ok ? "1" : "0";
    $("#fb-count").textContent = "受け入れは " + p.answer.length + "種" + p.left + "枚";
    $("#fb-tiles").textContent = p.answer.map(tileName).join("・");
    const parts = [];
    if (hit) parts.push("正しく選んだ " + hit + "種");
    if (miss) parts.push("選び漏れ " + miss + "種");
    if (extra) parts.push("選びすぎ " + extra + "種");
    $("#fb-tally").textContent = parts.join("、");
    $("#fb-theme").textContent = p.theme;
    $("#fb-note").textContent = p.note;
    feedback.hidden = false;
    $(".uk-actions").hidden = true;
    nextBtn.hidden = false;
    nextBtn.textContent = index + 1 < problems.length ? "次の問題へ" : "結果を見る";
    refreshSteps();
    refreshButtons();
    feedback.focus({ preventScroll: false });
  }

  function finish() {
    const total = problems.length;
    const okAll = problems.filter((p) => results[p.no] === 1).length;
    track("quiz_complete", {
      deck_id: DECK_ID,
      quiz_mode: "all",
      correct_count: runOk,
      question_count: runDone,
      correct_rate: runDone ? Math.round((runOk / runDone) * 100) : 0,
    });
    $("#play").hidden = true;
    $("#result").hidden = false;
    $("#result-score").textContent = okAll + "／" + total + "問 正解";
    $("#result-msg").textContent = okAll === total
      ? "全問正解です。受け入れを数える目はできています。アプリでは何切るの150問と、計算で配る練習の手が続きます。"
      : "選び漏れた受け入れは、手牌のどの塔子・対子につながるかを見直すと見つけやすくなります。";
    $("#result-title").focus();
  }

  answerBtn.addEventListener("click", judge);
  clearBtn.addEventListener("click", () => {
    selected = new Set();
    pickerButtons.forEach((btn) => btn.setAttribute("aria-pressed", "false"));
    refreshButtons();
  });
  nextBtn.addEventListener("click", () => {
    if (index + 1 < problems.length) {
      show(index + 1);
      $("#q-no").focus({ preventScroll: false });
    } else {
      finish();
    }
  });
  $("#restart-btn").addEventListener("click", () => {
    runOk = 0;
    runDone = 0;
    show(0);
    $("#q-no").focus();
  });
  stepsEl.addEventListener("click", (event) => {
    const b = event.target.closest("button[data-no]");
    if (!b) return;
    show(Number(b.dataset.no) - 1);
  });

  document.querySelectorAll("[data-app-link]").forEach((link) => {
    link.addEventListener("click", () => {
      track("quiz_app_click", { deck_id: DECK_ID, placement: link.dataset.placement || "" });
    });
  });

  const firstOpen = problems.findIndex((p) => results[p.no] === undefined);
  show(firstOpen === -1 ? 0 : firstOpen);
}

setup();
