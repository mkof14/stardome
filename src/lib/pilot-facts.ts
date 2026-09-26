import { normalizeHeard } from "@/lib/barge-in";
import { type PilotFactId, pilotFactText } from "@/lib/i18n/pilot-facts";
import type { Locale } from "@/lib/i18n/locales";

const RANGE =
  /(range|how far|how long|distance|reach|дальност|расстоян|на какое|до скольк|скільки|як далеко|alcance|portée|reichweite|مدى|距离|遠|どれくらい|טווח|מרחק)/;
const RADAR = /(radar|радар|رادار|レーダー|מכ״ם|מכ"ם|雷达)/;
const CAMERAS =
  /(camera|камер|тепловиз|swir|eo\/?ir|كامير|カメラ|מצלמ|相机|cámar|caméra|kamera)/;
const SONAR = /(sonar|сонар|سونار|ソナー|סונאר|声呐|sónar)/;
const SPECTRUM =
  /(spectrum|spectral|спектр|акустическ(ий|ий)? радар|acoustic radar|rf\b|сигнальн|频谱|スペクトル|طيف)/;
const SENSORS =
  /(sensor|датчик|сенсор|suite|комплекс обнаруж|detection suite|αισθητ|センサー|חייש|传感器|capteur|sensoren)/;
const INTERCEPT =
  /(interceptor|перехват|дрон.?перехват|uav.*(range|дальност)|interceptor drone|迎击|迎撃|معترض|מיירט)/;
const COUNTER =
  /(countermeasure|противодейств|рэб|ew\b|jamm|микроволн|microwave|电子战|電子戦|حرب إلكترون|לוחמה)/;
const DECIDES =
  /(who decide|кто решает|хто виріш|quién decide|qui décide|wer entscheid|من يقرر|谁决|誰が決|מי מחליט|replace the captain|заменяет капитан|капитан не пассажир)/;
const DEMO_LIVE = /(\bdemo\b|\blive\b|режим|учени|drill|空的 live|пустой live)/;
const PILOT_WHO =
  /(who are you|кто ты|кто вы|what are you|что ты такое|что такое pilot|what is pilot|я pilot|i am pilot)/;
const NAMES =
  /(what is starwall|что так(ое|ая) starwall|что такое agron|что такое stardome|who is stardome|starwall or stardome|разница между|difference between (starwall|agron|stardome)|who builds)/;
const STARLINK = /(starlink|satcom|maritime|priority|терминал)/;
const PLANS = /(plan|pricing|price|тариф|цен[аыу]|план|prix|preis|precio|料金|价格|מחיר|سعر)/;
const CONTAINERS =
  /(container|контейнер|conteneur|コンテナ|集装箱|מכולה|حاوية|iso|9,?500|автономн)/;
const HOW =
  /(how it works|как (это )?работ|як працю|comment ça|wie (es )?funkt|cómo funciona|كيف يعمل|怎么|どう動|איך זה)/;
const RISK = /(risk level|уровен(ь|и) риск|рівень ризик|nivel de riesgo|risikoniveau|خطر|风险|リスク|סיכון|normal|attention|elevated|critical)/;
const CONNECTIONS =
  /(connection.?map|карта соединен|тополог|support center|ядро|starDome core|connections map)/;
const AIS = /(\bais\b|аис\b|自動識別|自动识别)/;
const BLACKBOX = /(black ?box|чёрн(ый|ый) ящик|чорн|caja negra|boîte noire|黑匣|ブラックボックス|קופסה שחורה)/;
const REPLACE = /(replace (our )?(existing )?(equipment|radar|cameras)|менять (оборудование|радар)| rip out|выдирать|заменить оборудование)/;
const OFFLINE = /(lose connectivity|потеря(ть)? связ|если нет связи|offline|линк падает|satcom (down|падает))/;

function qOf(message: string) {
  return normalizeHeard(message);
}

export function matchPilotFact(message: string): PilotFactId | null {
  const q = qOf(message);
  if (!q) return null;
  if (RADAR.test(q) && RANGE.test(q)) return "radarRange";
  if (CAMERAS.test(q) && !RADAR.test(q)) return "cameras";
  if (SONAR.test(q)) return "sonar";
  if (SPECTRUM.test(q)) return "spectrum";
  if (INTERCEPT.test(q)) return "interceptors";
  if (COUNTER.test(q)) return "countermeasures";
  if (SENSORS.test(q) && (RANGE.test(q) || /what.*(sensor|датчик)|какие датчик|чем видит|what can it see/.test(q))) {
    return "sensors";
  }
  if (DECIDES.test(q)) return "decides";
  if (DEMO_LIVE.test(q) && /(что такое|what is|режим|switch|переключ|empty|пуст)/.test(q)) {
    return "demoLive";
  }
  if (PILOT_WHO.test(q)) return "pilotRole";
  if (NAMES.test(q)) return "names";
  if (STARLINK.test(q) && /(what|что|как|how|service|сервис|два)/.test(q)) return "starlink";
  if (PLANS.test(q)) return "plans";
  if (CONTAINERS.test(q) && !/countermeasure|противодейств/.test(q)) return "containers";
  if (HOW.test(q)) return "how";
  if (RISK.test(q) && /(what|что|как|four|четыре|уровн)/.test(q)) return "risk";
  if (CONNECTIONS.test(q)) return "connections";
  if (AIS.test(q)) return "ais";
  if (BLACKBOX.test(q)) return "blackbox";
  if (REPLACE.test(q)) return "replace";
  if (OFFLINE.test(q)) return "offline";
  if (RADAR.test(q) && /(как работ|how.*(radar|радар)|what is (the )?radar|что такое радар|aesa)/.test(q)) {
    return "radarRange";
  }
  return null;
}

export function isProductFactAsk(message: string) {
  return matchPilotFact(message) !== null;
}

export function pilotFactReply(message: string, locale: Locale): string | null {
  const id = matchPilotFact(message);
  if (!id) return null;
  return pilotFactText(id, locale);
}

/** A real question or topic, not a greeting. */
export function isContentAsk(message: string) {
  if (isProductFactAsk(message)) return true;
  const q = qOf(message);
  if (/[?¿？]/.test(message)) return true;
  return /(what|who|how|where|why|when|which|does|can you|на каком|на какое|сколько|как |что |чем |кто |где |зачем |почему |що |як |هل |什么|何|מה )/.test(
    ` ${q} `,
  );
}
