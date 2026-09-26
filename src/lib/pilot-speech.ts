export type SpeechTone = "brief" | "warn";
export type SpeechSpeaker = "pilot" | "officer";

export type SpeechProsody = {
  rate: string;
  pitch: string;
  volume: string;
  browserRate: number;
  browserPitch: number;
  style: "newscast" | "narration-professional";
  styledegree: string;
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
      rate: "+4%",
      pitch: "-16Hz",
      volume: "+28%",
      browserRate: 1.02,
      browserPitch: 0.6,
      style: "newscast",
      styledegree: "2",
    };
  }
  return {
    rate: "-6%",
    pitch: "-10Hz",
    volume: "+14%",
    browserRate: 0.92,
    browserPitch: 0.74,
    style: "narration-professional",
    styledegree: "1.4",
  };
}

export function ssmlInner(text: string, tone: SpeechTone, escape: (value: string) => string) {
  const parts = text
    .split(/(?<=[.!?…。！？])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const chunks = (parts.length ? parts : [text]).map((part) => {
    const safe = escape(part);
    return tone === "warn" ? `<emphasis level="strong">${safe}</emphasis>` : safe;
  });
  return chunks.join('<break time="260ms"/>');
}
