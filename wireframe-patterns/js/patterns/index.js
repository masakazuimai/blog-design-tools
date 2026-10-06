// パターン定義の集約。カテゴリの並びはページの上から下の順
import header from "./header.js?v=20261006h";
import hero from "./hero.js?v=20261006h";
import pricing from "./pricing.js?v=20261006h";
import footer from "./footer.js?v=20261006h";
import features from "./features.js?v=20261006h";
import cases from "./cases.js?v=20261006h";
import cards from "./cards.js?v=20261006h";
import steps from "./steps.js?v=20261006h";
import faq from "./faq.js?v=20261006h";
import cta from "./cta.js?v=20261006h";
import form from "./form.js?v=20261006h";
import company from "./company.js?v=20261006h";
import { CATEGORY_EN } from "./en-meta.js?v=20261006h";
import { localizePattern } from "./localize.js?v=20261006h";
import { LANG } from "../i18n.js?v=20261006h";

const CATEGORIES_JA = [
  { id: "header", name: "ヘッダー" },
  { id: "hero", name: "ファーストビュー" },
  { id: "features", name: "特長・メリット" },
  { id: "cases", name: "導入事例・お客様の声" },
  { id: "cards", name: "カード一覧" },
  { id: "steps", name: "流れ・ステップ" },
  { id: "pricing", name: "料金表" },
  { id: "faq", name: "FAQ" },
  { id: "cta", name: "CTA" },
  { id: "form", name: "お問い合わせフォーム" },
  { id: "company", name: "会社概要・アクセス" },
  { id: "footer", name: "フッター" },
];

const PATTERNS_JA = [...header, ...hero, ...features, ...cases, ...cards, ...steps, ...pricing, ...faq, ...cta, ...form, ...company, ...footer];

// 英語ページでは、カテゴリ名とパターン（説明文・HTML/CSS内の文言）を英語に差し替える
export const CATEGORIES = LANG === "en"
  ? CATEGORIES_JA.map((c) => ({ ...c, name: CATEGORY_EN[c.id] }))
  : CATEGORIES_JA;

export const PATTERNS = LANG === "en" ? PATTERNS_JA.map(localizePattern) : PATTERNS_JA;

const BY_ID = new Map(PATTERNS.map((p) => [p.id, p]));

export const getPattern = (id) => BY_ID.get(id);

export const categoryName = (id) => CATEGORIES.find((c) => c.id === id)?.name ?? id;
