// パターン定義の集約。カテゴリの並びはページの上から下の順
import header from "./header.js?v=20261006f";
import hero from "./hero.js?v=20261006f";
import pricing from "./pricing.js?v=20261006f";
import footer from "./footer.js?v=20261006f";
import features from "./features.js?v=20261006f";
import cases from "./cases.js?v=20261006f";
import cards from "./cards.js?v=20261006f";
import steps from "./steps.js?v=20261006f";
import faq from "./faq.js?v=20261006f";
import cta from "./cta.js?v=20261006f";
import form from "./form.js?v=20261006f";
import company from "./company.js?v=20261006f";

export const CATEGORIES = [
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

export const PATTERNS = [...header, ...hero, ...features, ...cases, ...cards, ...steps, ...pricing, ...faq, ...cta, ...form, ...company, ...footer];

const BY_ID = new Map(PATTERNS.map((p) => [p.id, p]));

export const getPattern = (id) => BY_ID.get(id);

export const categoryName = (id) => CATEGORIES.find((c) => c.id === id)?.name ?? id;
