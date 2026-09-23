export type SpeechTone = "brief" | "warn";
export type SpeechSpeaker = "pilot" | "officer";

export type SpeechProsody = {
  rate: string;
  pitch: string;
  volume: string;
  browserRate: number;
  browserPitch: number;
};

export function isSpeechTone(value: unknown): value is SpeechTone {
  return value === "brief" || value === "warn";
}

export function isSpeechSpeaker(value: unknown): value is SpeechSpeaker {
  return value === "pilot" || value === "officer";
}

export function speechToneFor(text: string, crisis = false): SpeechTone {
  if (crisis) return "warn";
  const sample = text.trim();
  if (!sample) return "brief";
  if (
    /\b(critical|crisis|alarm|urgent|immediate|notify|confirm|designated|warning|evacuate)\b/i.test(
      sample,
    )
  ) {
    return "warn";
  }
  if (
    /(критич|кризис|аларм|тревог|тривог|немедлен|негайн|срочн|підтверд|подтверд|уведом|сповіст|назначенн|призначен|опасн|небезпеч|эвакуац|евакуац)/i.test(
      sample,
    )
  ) {
    return "warn";
  }
  if (
    /\b(crític[oa]|crisis|alarma|urgente|inmediato|confirmar|designad|advertencia|evacuar|critique|crise|alarme|immédiat|confirmer|désigné|avertissement|évacuer|kritisch|krise|dringend|sofort|bestätigen|warnung|evakuieren)\b/i.test(
      sample,
    )
  ) {
    return "warn";
  }
  if (
    /(حرج|أزمة|إنذار|عاجل|فوري|تحذير|إخلاء|危急|危机|警报|紧急|立即|警告|撤离|重大|危機|警報|緊急|直ちに|警告|避難|קריטי|משבר|אזעקה|דחוף|מיידי|אזהרה|פינוי)/i.test(
      sample,
    )
  ) {
    return "warn";
  }
  return "brief";
}

export function speechProsody(tone: SpeechTone): SpeechProsody {
  if (tone === "warn") {
    return {
      rate: "+12%",
      pitch: "-12Hz",
      volume: "+36%",
      browserRate: 1.1,
      browserPitch: 0.68,
    };
  }
  return {
    rate: "+20%",
    pitch: "-2Hz",
    volume: "+18%",
    browserRate: 1.2,
    browserPitch: 0.92,
  };
}

export function ssmlInner(text: string, tone: SpeechTone, escape: (value: string) => string) {
  const safe = escape(text);
  if (tone === "warn") return `<emphasis level="strong">${safe}</emphasis>`;
  return safe;
}
