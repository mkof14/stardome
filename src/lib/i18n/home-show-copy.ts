import type { Locale } from "@/lib/i18n/locales";

export type HomeShowCopy = {
  doorsKicker: string;
  watchPick: [number, number, number, number];
  envelopeKicker: string;
  envelopeTitle: string;
  envelopeLead: string;
  envelopeDetect: string;
  envelopeRespond: string;
  envelopeNote: string;
  envelopeCta: string;
};

const en: HomeShowCopy = {
  doorsKicker: "Open a page",
  watchPick: [0, 1, 2, 5],
  envelopeKicker: "AGRON envelopes",
  envelopeTitle: "How far you see. How far you can answer.",
  envelopeLead:
    "Detection on the left — radar, RF, cameras, sonar. Response on the right — interceptor, electronic warfare, directed energy. The yacht is the watch. The rings are the design envelope, not a promise for this hull.",
  envelopeDetect: "Detection",
  envelopeRespond: "Response",
  envelopeNote:
    "A response bay does not fire itself. A person authorizes it, and local law still applies.",
  envelopeCta: "Open AGRON 1 →",
};

const ru: HomeShowCopy = {
  doorsKicker: "Открыть страницу",
  watchPick: [0, 1, 2, 5],
  envelopeKicker: "Огибающие AGRON",
  envelopeTitle: "Как далеко видите. Как далеко можете ответить.",
  envelopeLead:
    "Слева обнаружение — радар, радио, камеры, сонар. Справа ответ — перехватчик, радиоэлектронная борьба, направленная энергия. Яхта — вахта. Кольца на схеме — расчётная огибающая, не обещание для этого корпуса.",
  envelopeDetect: "Обнаружение",
  envelopeRespond: "Ответ",
  envelopeNote:
    "Отсек реагирования сам не стреляет. Человек разрешает, местное право остаётся.",
  envelopeCta: "Открыть AGRON 1 →",
};

const uk: HomeShowCopy = {
  doorsKicker: "Відкрити сторінку",
  watchPick: [0, 1, 2, 5],
  envelopeKicker: "Огинальні AGRON",
  envelopeTitle: "Як далеко бачите. Як далеко можете відповісти.",
  envelopeLead:
    "Ліворуч виявлення — радар, радіо, камери, сонар. Праворуч відповідь — перехоплювач, радіоелектронна боротьба, спрямована енергія. Яхта — вахта. Кільця на схемі — розрахункова огинальна, не обіцянка для цього корпусу.",
  envelopeDetect: "Виявлення",
  envelopeRespond: "Відповідь",
  envelopeNote:
    "Відсік реагування сам не стріляє. Людина дозволяє, місцеве право лишається.",
  envelopeCta: "Відкрити AGRON 1 →",
};

const de: HomeShowCopy = {
  doorsKicker: "Eine Seite öffnen",
  watchPick: [0, 1, 2, 5],
  envelopeKicker: "AGRON-Hüllen",
  envelopeTitle: "Wie weit Sie sehen. Wie weit Sie antworten können.",
  envelopeLead:
    "Links Erfassung — Radar, Funk, Kameras, Sonar. Rechts Antwort — Abfänger, elektronische Kampfführung, gerichtete Energie. Die Yacht ist die Wache. Die Ringe sind die Auslegungshülle, kein Versprechen für diesen Rumpf.",
  envelopeDetect: "Erfassung",
  envelopeRespond: "Antwort",
  envelopeNote:
    "Eine Wirkbucht schießt nicht selbst. Ein Mensch gibt frei, örtliches Recht bleibt.",
  envelopeCta: "AGRON 1 öffnen →",
};

const es: HomeShowCopy = {
  doorsKicker: "Abrir una página",
  watchPick: [0, 1, 2, 5],
  envelopeKicker: "Envolventes AGRON",
  envelopeTitle: "Hasta dónde ve. Hasta dónde puede responder.",
  envelopeLead:
    "A la izquierda, detección: radar, RF, cámaras, sónar. A la derecha, respuesta: interceptor, guerra electrónica, energía dirigida. El yate es la guardia. Los anillos son la envolvente de diseño, no una promesa para este casco.",
  envelopeDetect: "Detección",
  envelopeRespond: "Respuesta",
  envelopeNote:
    "La bahía de respuesta no dispara sola. Una persona autoriza, y rige la ley local.",
  envelopeCta: "Abrir AGRON 1 →",
};

const fr: HomeShowCopy = {
  doorsKicker: "Ouvrir une page",
  watchPick: [0, 1, 2, 5],
  envelopeKicker: "Enveloppes AGRON",
  envelopeTitle: "Jusqu'où vous voyez. Jusqu'où vous pouvez répondre.",
  envelopeLead:
    "À gauche, la détection — radar, RF, caméras, sonar. À droite, la réponse — intercepteur, guerre électronique, énergie dirigée. Le yacht est le quart. Les anneaux sont l'enveloppe de conception, pas une promesse pour cette coque.",
  envelopeDetect: "Détection",
  envelopeRespond: "Réponse",
  envelopeNote:
    "Une baie de réponse ne tire pas seule. Une personne autorise, le droit local reste.",
  envelopeCta: "Ouvrir AGRON 1 →",
};

const ar: HomeShowCopy = {
  doorsKicker: "افتحوا صفحة",
  watchPick: [0, 1, 2, 5],
  envelopeKicker: "أغلفة AGRON",
  envelopeTitle: "إلى أي مدى ترون. إلى أي مدى تستطيعون الرد.",
  envelopeLead:
    "اليسار كشف: رادار وترددات وكاميرات وصوت. اليمين رد: اعتراض وحرب إلكترونية وطاقة موجّهة. اليخت هو النوبة. الحلقات غلاف تصميم، لا وعد لهذا الهيكل.",
  envelopeDetect: "كشف",
  envelopeRespond: "رد",
  envelopeNote: "حجرة الرد لا تطلق وحدها. يأذن إنسان، والقانون المحلي يبقى.",
  envelopeCta: "افتحوا AGRON 1 →",
};

const zh: HomeShowCopy = {
  doorsKicker: "打开一页",
  watchPick: [0, 1, 2, 5],
  envelopeKicker: "AGRON 包络",
  envelopeTitle: "看得有多远。能回答多远。",
  envelopeLead:
    "左侧是探测——雷达、射频、摄像机、声呐。右侧是响应——拦截、电子战、定向能。游艇就是值班。环线是设计包络，不是对这艘船体的承诺。",
  envelopeDetect: "探测",
  envelopeRespond: "响应",
  envelopeNote: "响应舱不会自行开火。由人授权，当地法律仍然有效。",
  envelopeCta: "打开 AGRON 1 →",
};

const ja: HomeShowCopy = {
  doorsKicker: "ページを開く",
  watchPick: [0, 1, 2, 5],
  envelopeKicker: "AGRON エンベロープ",
  envelopeTitle: "どこまで見えるか。どこまで答えられるか。",
  envelopeLead:
    "左は探知 — レーダー、RF、カメラ、ソナー。右は対応 — 迎撃、電子戦、指向性エネルギー。ヨットが当直です。環は設計エンベロープであり、この船体への約束ではありません。",
  envelopeDetect: "探知",
  envelopeRespond: "対応",
  envelopeNote: "対応ベイは自ら撃ちません。人が許可し、現地法が残ります。",
  envelopeCta: "AGRON 1 を開く →",
};

const he: HomeShowCopy = {
  doorsKicker: "לפתוח עמוד",
  watchPick: [0, 1, 2, 5],
  envelopeKicker: "מעטפות AGRON",
  envelopeTitle: "עד כמה רואים. עד כמה אפשר לענות.",
  envelopeLead:
    "משמאל גילוי — מכ״ם, תדר, מצלמות, סונאר. מימין מענה — יירוט, לוחמה אלקטרונית, אנרגיה מכוונת. היאכטה היא המשמרת. הטבעות הן מעטפת תכנון, לא הבטחה לגוף הזה.",
  envelopeDetect: "גילוי",
  envelopeRespond: "מענה",
  envelopeNote: "תא המענה לא יורה מעצמו. אדם מאשר, והחוק המקומי נשאר.",
  envelopeCta: "לפתוח את AGRON 1 →",
};

const COPY: Record<Locale, HomeShowCopy> = {
  en,
  ru,
  uk,
  de,
  es,
  fr,
  ar,
  zh,
  ja,
  he,
};

export function homeShowCopy(locale: Locale): HomeShowCopy {
  return COPY[locale] ?? en;
}
