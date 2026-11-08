const PREFIX = "cq-quiz:";
const VERSION = ":v1";

const keyOf = (deckId) => PREFIX + deckId + VERSION;

const empty = () => ({ results: {}, run: null });

export function load(deckId) {
  try {
    const raw = window.localStorage.getItem(keyOf(deckId));
    if (!raw) return empty();
    const parsed = JSON.parse(raw);
    return {
      results: parsed && typeof parsed.results === "object" && parsed.results ? parsed.results : {},
      run: parsed && parsed.run && Array.isArray(parsed.run.ids) ? parsed.run : null,
    };
  } catch (error) {
    return empty();
  }
}

export function save(deckId, state) {
  try {
    window.localStorage.setItem(keyOf(deckId), JSON.stringify(state));
    return true;
  } catch (error) {
    return false;
  }
}

export function clear(deckId) {
  try {
    window.localStorage.removeItem(keyOf(deckId));
  } catch (error) {
    return;
  }
}

export function tally(results, ids) {
  let ok = 0;
  let ng = 0;
  ids.forEach((id) => {
    if (results[id] === 1) ok += 1;
    else if (results[id] === 0) ng += 1;
  });
  return { ok, ng, done: ok + ng };
}

export function track(event, params) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}
