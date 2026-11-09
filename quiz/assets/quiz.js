import { load, save, clear, tally, track } from "./store.js?v=20261109a";
import { setupAppLinks } from "./app-link.js?v=20261109a";

const PASS_RATE = 0.6;
const MODE_LABEL = { all: "全問", wrong: "間違えた問題", retry: "解き直し" };

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function readData() {
  const node = document.getElementById("quiz-data");
  if (!node) throw new Error("問題のデータが見つかりません");
  const data = JSON.parse(node.textContent);
  if (!data || !Array.isArray(data.questions) || data.questions.length === 0) {
    throw new Error("問題のデータが空です");
  }
  return data;
}

function shuffled(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function sanitize(state, byId) {
  const results = {};
  Object.keys(state.results).forEach((id) => {
    if (byId.has(id) && (state.results[id] === 0 || state.results[id] === 1)) results[id] = state.results[id];
  });
  let run = null;
  if (state.run) {
    const ids = state.run.ids.filter((id) => byId.has(id));
    const index = Math.min(Number(state.run.index) || 0, ids.length);
    if (ids.length > 0 && index < ids.length) {
      run = {
        mode: MODE_LABEL[state.run.mode] ? state.run.mode : "all",
        ids,
        index,
        ok: Math.max(0, Number(state.run.ok) || 0),
        wrongIds: Array.isArray(state.run.wrongIds) ? state.run.wrongIds.filter((id) => byId.has(id)) : [],
        answered: Boolean(state.run.answered),
      };
      if (run.answered) {
        run.index += 1;
        run.answered = false;
        if (run.index >= run.ids.length) run = null;
      }
    }
  }
  return { results, run };
}

function init() {
  const data = readData();
  const deckId = data.deckId;
  const questions = data.questions;
  const passRatio = typeof data.passRatio === "number" ? data.passRatio : PASS_RATE;
  const passLabel = data.passLabel || "本番の合格ライン（各科目60%）";
  const byId = new Map(questions.map((q) => [q.id, q]));
  const allIds = questions.map((q) => q.id);

  let state = sanitize(load(deckId), byId);
  let lastWrong = [];

  const views = {
    intro: $('[data-view="intro"]'),
    play: $('[data-view="play"]'),
    result: $('[data-view="result"]'),
  };

  const persist = () => save(deckId, state);

  function show(name) {
    Object.entries(views).forEach(([key, el]) => {
      el.hidden = key !== name;
    });
    document.body.dataset.view = name;
  }

  function wrongIdsFromResults() {
    return allIds.filter((id) => state.results[id] === 0);
  }

  function paintIntro() {
    const { ok, ng, done } = tally(state.results, allIds);
    $("[data-t-done]").textContent = String(done);
    $("[data-t-ok]").textContent = String(ok);
    $("[data-t-ng]").textContent = String(ng);

    const resume = $('[data-start="resume"]');
    resume.hidden = !state.run;
    if (state.run) {
      $("[data-resume-at]").textContent =
        MODE_LABEL[state.run.mode] + "の" + (state.run.index + 1) + "問目から";
    }
    const wrong = $('[data-start="wrong"]');
    const wrongCount = wrongIdsFromResults().length;
    wrong.hidden = wrongCount === 0;
    $("[data-wrong-count]").textContent = wrongCount + "問";
    $("[data-reset]").hidden = done === 0 && !state.run;
    const all = $('[data-start="all"]', views.intro);
    all.classList.toggle("btn--primary", !state.run);
    all.classList.toggle("btn--ghost", Boolean(state.run));
  }

  function startRun(mode, ids) {
    if (ids.length === 0) return;
    state = {
      ...state,
      run: { mode, ids: mode === "all" ? ids.slice() : shuffled(ids), index: 0, ok: 0, wrongIds: [], answered: false },
    };
    persist();
    paintQuestion();
  }

  function paintQuestion() {
    const run = state.run;
    const q = byId.get(run.ids[run.index]);
    show("play");
    $("[data-pos]").textContent = String(run.index + 1);
    $("[data-len]").textContent = String(run.ids.length);
    $("[data-mode-label]").textContent = MODE_LABEL[run.mode];
    $("[data-play-meter]").style.width = Math.round((run.index / run.ids.length) * 100) + "%";
    const qEl = $("[data-q]");
    qEl.textContent = q.q;

    const list = $("[data-choices]");
    list.replaceChildren();
    shuffled([{ text: q.a, correct: true }, ...q.w.map((text) => ({ text, correct: false }))]).forEach((opt, i) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice";
      btn.dataset.correct = opt.correct ? "1" : "0";
      const num = document.createElement("span");
      num.className = "choice__num";
      num.textContent = String(i + 1);
      const text = document.createElement("span");
      text.className = "choice__text";
      text.textContent = opt.text;
      const mark = document.createElement("span");
      mark.className = "choice__mark";
      btn.append(num, text, mark);
      btn.addEventListener("click", () => answer(btn));
      li.append(btn);
      list.append(li);
    });

    $("[data-verdict]").hidden = true;
    $("[data-next-wrap]").hidden = true;
    views.play.classList.remove("is-answered");
    window.scrollTo({ top: 0 });
    qEl.focus({ preventScroll: true });
  }

  function answer(btn) {
    const run = state.run;
    if (!run || run.answered) return;
    const q = byId.get(run.ids[run.index]);
    const isCorrect = btn.dataset.correct === "1";

    $$(".choice").forEach((el) => {
      el.disabled = true;
      if (el.dataset.correct === "1") {
        el.classList.add("is-correct");
        $(".choice__mark", el).textContent = "正解";
      }
    });
    btn.classList.add("is-picked");
    if (!isCorrect) {
      btn.classList.add("is-wrong");
      $(".choice__mark", btn).textContent = "あなたの答え";
    }

    state = {
      results: { ...state.results, [q.id]: isCorrect ? 1 : 0 },
      run: {
        ...run,
        ok: run.ok + (isCorrect ? 1 : 0),
        wrongIds: isCorrect ? run.wrongIds : [...run.wrongIds, q.id],
        answered: true,
      },
    };
    persist();
    track("quiz_answer", { deck_id: deckId, question_id: q.id, is_correct: isCorrect, quiz_mode: run.mode });

    const verdict = $("[data-verdict]");
    verdict.classList.toggle("is-correct", isCorrect);
    verdict.classList.toggle("is-wrong", !isCorrect);
    $("[data-verdict-head]").textContent = isCorrect ? "正解" : "不正解";
    $("[data-verdict-answer]").textContent = q.a;
    $("[data-verdict-note]").textContent = q.note;
    const srcBox = $("[data-verdict-src]");
    const srcList = $("[data-verdict-src-list]");
    srcList.replaceChildren(...q.src.map((s) => {
      const li = document.createElement("li");
      li.textContent = s;
      return li;
    }));
    srcBox.hidden = q.src.length === 0;
    verdict.hidden = false;

    const isLast = run.index + 1 >= run.ids.length;
    $("[data-next]").textContent = isLast ? "結果を見る" : "次の問題へ";
    $("[data-next-wrap]").hidden = false;
    views.play.classList.add("is-answered");
    $("[data-next]").focus({ preventScroll: true });
    $("[data-play-meter]").style.width = Math.round(((run.index + 1) / run.ids.length) * 100) + "%";
  }

  function next() {
    const run = state.run;
    if (!run || !run.answered) return;
    if (run.index + 1 >= run.ids.length) {
      finish();
      return;
    }
    state = { ...state, run: { ...run, index: run.index + 1, answered: false } };
    persist();
    paintQuestion();
  }

  function finish() {
    const run = state.run;
    const len = run.ids.length;
    lastWrong = run.wrongIds.slice();
    track("quiz_complete", {
      deck_id: deckId,
      quiz_mode: run.mode,
      correct_count: run.ok,
      question_count: len,
      correct_rate: Math.round((run.ok / len) * 100),
    });
    state = { ...state, run: null };
    persist();

    show("result");
    $("[data-r-ok]").textContent = String(run.ok);
    $("[data-r-len]").textContent = String(len);
    const rate = run.ok / len;
    $("[data-r-meter]").style.width = Math.round(rate * 100) + "%";
    const need = Math.ceil(len * passRatio) - run.ok;
    $("[data-r-text]").textContent =
      "正解率 " + Math.round(rate * 100) + "%。" +
      (need <= 0 ? passLabel + "を超えています。" : passLabel + "まで、あと" + need + "問です。");
    $("[data-passline]").classList.toggle("is-pass", need <= 0);
    const again = $("[data-again-wrong]");
    again.hidden = lastWrong.length === 0;
    $("[data-r-ng]").textContent = String(lastWrong.length);
    $("#result-title").textContent = lastWrong.length === 0 ? "全問正解です" : "おつかれさまでした";
    window.scrollTo({ top: 0 });
    $("#result-title").focus({ preventScroll: true });
  }

  function toIntro() {
    paintIntro();
    show("intro");
    window.scrollTo({ top: 0 });
  }

  $$('[data-start="all"]').forEach((el) => el.addEventListener("click", () => startRun("all", allIds)));
  $('[data-start="wrong"]').addEventListener("click", () => startRun("wrong", wrongIdsFromResults()));
  $('[data-start="resume"]').addEventListener("click", () => {
    if (state.run) paintQuestion();
  });
  $("[data-again-wrong]").addEventListener("click", () => startRun("retry", lastWrong));
  $("[data-next]").addEventListener("click", next);
  $("[data-quit]").addEventListener("click", toIntro);
  $("[data-reset]").addEventListener("click", () => {
    if (!window.confirm("この科目の解いた記録を消します。よろしいですか？")) return;
    clear(deckId);
    state = { results: {}, run: null };
    toIntro();
  });

  document.addEventListener("keydown", (event) => {
    if (views.play.hidden || event.metaKey || event.ctrlKey || event.altKey) return;
    const n = Number(event.key);
    if (n >= 1 && n <= 4 && state.run && !state.run.answered) {
      const btn = $$(".choice")[n - 1];
      if (btn) answer(btn);
    }
  });

  toIntro();
  setupAppLinks();
}

try {
  init();
} catch (error) {
  console.error("問題集の読み込みに失敗しました:", error);
  const intro = document.querySelector('[data-view="intro"]');
  if (intro) {
    const p = document.createElement("p");
    p.className = "intro__noscript";
    p.textContent = "問題を読み込めませんでした。ページを再読み込みしてください。";
    intro.append(p);
  }
}
