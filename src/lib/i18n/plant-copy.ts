import type { Locale } from "@/lib/i18n/locales";
import type { KitKind, KitStatus } from "@/lib/watch-kit";
import type { PlantSectionId, PlantTone } from "@/lib/plant-metrics";

export type PlantCopy = {
  viewGroup: string;
  watch: string;
  plant: string;
  plantLead: string;
  liveLead: string;
  kitTitle: string;
  kitLead: string;
  kinds: Record<KitKind, string>;
  status: Record<KitStatus, string>;
  sections: Record<PlantSectionId, string>;
  tones: Record<PlantTone, string>;
};

const COPY: Record<Locale, PlantCopy> = {
  en: {
    viewGroup: "AGRON 1 screen",
    watch: "WATCH",
    plant: "Monitoring",
    plantLead:
      "AGRON Container plant — power, climate, compute, and recorder. DEMO numbers. LIVE stays empty until the box is wired.",
    liveLead: "LIVE — no container telemetry on this install. Switch to DEMO to see the plant drill.",
    kitTitle: "MEASUREMENT KIT",
    kitLead: "Radar types, underwater, RF, and comms paths feeding AGRON 1 — including two Starlink services.",
    kinds: { radar: "RADAR", underwater: "UNDERWATER", rf: "RF / RADIO", comms: "COMMS" },
    status: {
      watching: "WATCHING",
      standby: "STANDBY",
      degraded: "DEGRADED",
      offline: "OFFLINE",
      dark: "DARK",
    },
    sections: {
      container: "CONTAINER",
      power: "POWER",
      cooling: "COOLING",
      sensors: "SENSORS",
      comms: "COMMS",
      compute: "COMPUTE",
      storage: "STORAGE / BLACK BOX",
    },
    tones: { ok: "OK", warn: "WARN", fail: "FAIL", dark: "DARK" },
  },
  ru: {
    viewGroup: "Экран AGRON 1",
    watch: "WATCH",
    plant: "Мониторинг",
    plantLead:
      "Установка контейнера AGRON — питание, климат, вычислители и регистратор. Цифры DEMO. LIVE пуст, пока ящик не подключён.",
    liveLead: "LIVE — телеметрии контейнера на этой установке нет. Переключите DEMO, чтобы увидеть учение.",
    kitTitle: "ИЗМЕРИТЕЛЬНЫЙ КОМПЛЕКТ",
    kitLead: "Типы радаров, подводные датчики, радио и каналы связи AGRON 1, включая два сервиса Starlink.",
    kinds: { radar: "РАДАР", underwater: "ПОД ВОДОЙ", rf: "РФ / РАДИО", comms: "СВЯЗЬ" },
    status: {
      watching: "СМОТРИТ",
      standby: "ДЕЖУРНЫЙ",
      degraded: "ДЕГРАДАЦИЯ",
      offline: "НЕТ",
      dark: "ТЕМНО",
    },
    sections: {
      container: "КОНТЕЙНЕР",
      power: "ПИТАНИЕ",
      cooling: "ОХЛАЖДЕНИЕ",
      sensors: "ДАТЧИКИ",
      comms: "СВЯЗЬ",
      compute: "ВЫЧИСЛИТЕЛИ",
      storage: "ХРАНЕНИЕ / BLACK BOX",
    },
    tones: { ok: "OK", warn: "ВНИМАНИЕ", fail: "ОТКАЗ", dark: "ТЕМНО" },
  },
  uk: {
    viewGroup: "Екран AGRON 1",
    watch: "WATCH",
    plant: "Моніторинг",
    plantLead:
      "Установка контейнера AGRON — живлення, клімат, обчислювачі й реєстратор. Цифри DEMO. LIVE порожній, доки ящик не підключено.",
    liveLead: "LIVE — телеметрії контейнера на цій установці немає. Перемкніть DEMO, щоб побачити навчання.",
    kitTitle: "ВИМІРЮВАЛЬНИЙ КОМПЛЕКТ",
    kitLead: "Типи радарів, підводні датчики, радіо й канали зв'язку, що живлять AGRON 1.",
    kinds: { radar: "РАДАР", underwater: "ПІД ВОДОЮ", rf: "РЧ / РАДІО", comms: "ЗВ'ЯЗОК" },
    status: {
      watching: "ДИВИТЬСЯ",
      standby: "ЧЕРГОВИЙ",
      degraded: "ДЕГРАДАЦІЯ",
      offline: "НЕМАЄ",
      dark: "ТЕМНО",
    },
    sections: {
      container: "КОНТЕЙНЕР",
      power: "ЖИВЛЕННЯ",
      cooling: "ОХОЛОДЖЕННЯ",
      sensors: "ДАТЧИКИ",
      comms: "ЗВ'ЯЗОК",
      compute: "ОБЧИСЛЮВАЧІ",
      storage: "СХОВИЩЕ / BLACK BOX",
    },
    tones: { ok: "OK", warn: "УВАГА", fail: "ВІДМОВА", dark: "ТЕМНО" },
  },
  es: {
    viewGroup: "Pantalla AGRON 1",
    watch: "WATCH",
    plant: "Monitoreo",
    plantLead:
      "Planta del contenedor AGRON — energía, clima, cómputo y registrador. Cifras DEMO. LIVE vacío hasta cablear la caja.",
    liveLead: "LIVE — no hay telemetría del contenedor en esta instalación. Pase a DEMO para ver el ejercicio.",
    kitTitle: "KIT DE MEDICIÓN",
    kitLead: "Tipos de radar, sensores submarinos, radio y caminos de comms que alimentan AGRON 1.",
    kinds: { radar: "RADAR", underwater: "SUBMARINO", rf: "RF / RADIO", comms: "COMMS" },
    status: {
      watching: "VIGILA",
      standby: "ESPERA",
      degraded: "DEGRADADO",
      offline: "FUERA",
      dark: "OSCURO",
    },
    sections: {
      container: "CONTENEDOR",
      power: "ENERGÍA",
      cooling: "REFRIGERACIÓN",
      sensors: "SENSORES",
      comms: "COMMS",
      compute: "CÓMPUTO",
      storage: "ALMACÉN / BLACK BOX",
    },
    tones: { ok: "OK", warn: "AVISO", fail: "FALLO", dark: "OSCURO" },
  },
  fr: {
    viewGroup: "Écran AGRON 1",
    watch: "WATCH",
    plant: "Supervision",
    plantLead:
      "Installation du conteneur AGRON — énergie, climat, calculateurs et enregistreur. Chiffres DEMO. LIVE vide tant que le caisson n'est pas câblé.",
    liveLead: "LIVE — pas de télémétrie conteneur sur cette installation. Passez en DEMO pour l'exercice.",
    kitTitle: "KIT DE MESURE",
    kitLead: "Types de radar, capteurs sous-marins, radio et liaisons qui alimentent AGRON 1.",
    kinds: { radar: "RADAR", underwater: "SOUS-MARIN", rf: "RF / RADIO", comms: "LIAISONS" },
    status: {
      watching: "EN VEILLE",
      standby: "ATTENTE",
      degraded: "DÉGRADÉ",
      offline: "HORS LIGNE",
      dark: "SOMBRE",
    },
    sections: {
      container: "CONTENEUR",
      power: "ÉNERGIE",
      cooling: "REFROIDISSEMENT",
      sensors: "CAPTEURS",
      comms: "LIAISONS",
      compute: "CALCUL",
      storage: "STOCKAGE / BLACK BOX",
    },
    tones: { ok: "OK", warn: "ALERTE", fail: "PANNE", dark: "SOMBRE" },
  },
  de: {
    viewGroup: "AGRON 1-Bildschirm",
    watch: "WATCH",
    plant: "Überwachung",
    plantLead:
      "AGRON-Containeranlage — Energie, Klima, Rechner und Recorder. DEMO-Zahlen. LIVE leer, bis die Box verdrahtet ist.",
    liveLead: "LIVE — keine Container-Telemetrie auf dieser Anlage. Für die Übung auf DEMO schalten.",
    kitTitle: "MESSSATZ",
    kitLead: "Radararten, Unterwassersensoren, Funk und Verbindungswege, die AGRON 1 speisen.",
    kinds: { radar: "RADAR", underwater: "UNTER WASSER", rf: "HF / FUNK", comms: "FUNK" },
    status: {
      watching: "WACHT",
      standby: "BEREIT",
      degraded: "GESENKT",
      offline: "AUS",
      dark: "DUNKEL",
    },
    sections: {
      container: "CONTAINER",
      power: "ENERGIE",
      cooling: "KÜHLUNG",
      sensors: "SENSOREN",
      comms: "FUNK",
      compute: "RECHNER",
      storage: "SPEICHER / BLACK BOX",
    },
    tones: { ok: "OK", warn: "WARN", fail: "AUSFALL", dark: "DUNKEL" },
  },
  ar: {
    viewGroup: "شاشة AGRON 1",
    watch: "WATCH",
    plant: "مراقبة",
    plantLead:
      "محطة حاوية AGRON — طاقة ومناخ وحواسيب ومسجل. أرقام DEMO. LIVE فارغ إلى أن تُوصَل الصندوق.",
    liveLead: "LIVE — لا قياس للحاوية على هذا التركيب. انتقل إلى DEMO للتمرين.",
    kitTitle: "طقم القياس",
    kitLead: "أنواع رادار، حساسات تحت الماء، راديو ومسارات اتصال تغذي AGRON 1.",
    kinds: { radar: "رادار", underwater: "تحت الماء", rf: "تردد / راديو", comms: "اتصال" },
    status: {
      watching: "يراقب",
      standby: "انتظار",
      degraded: "متدهور",
      offline: "متوقف",
      dark: "مظلم",
    },
    sections: {
      container: "الحاوية",
      power: "الطاقة",
      cooling: "التبريد",
      sensors: "الحساسات",
      comms: "الاتصال",
      compute: "الحواسيب",
      storage: "التخزين / BLACK BOX",
    },
    tones: { ok: "سليم", warn: "تنبيه", fail: "عطل", dark: "مظلم" },
  },
  zh: {
    viewGroup: "AGRON 1 屏幕",
    watch: "WATCH",
    plant: "监测",
    plantLead: "AGRON 集装箱机组 — 电力、气候、计算与记录。DEMO 数字。未接线时 LIVE 为空。",
    liveLead: "LIVE — 本安装没有集装箱遥测。切到 DEMO 查看演练。",
    kitTitle: "测量套件",
    kitLead: "雷达种类、水下传感器、无线电与通信路径，供给 AGRON 1。",
    kinds: { radar: "雷达", underwater: "水下", rf: "射频 / 无线电", comms: "通信" },
    status: {
      watching: "监视",
      standby: "待机",
      degraded: "降级",
      offline: "中断",
      dark: "无数据",
    },
    sections: {
      container: "集装箱",
      power: "电力",
      cooling: "冷却",
      sensors: "传感器",
      comms: "通信",
      compute: "计算",
      storage: "存储 / BLACK BOX",
    },
    tones: { ok: "正常", warn: "告警", fail: "故障", dark: "无数据" },
  },
  ja: {
    viewGroup: "AGRON 1 画面",
    watch: "WATCH",
    plant: "監視",
    plantLead:
      "AGRON コンテナ設備 — 電源、気候、計算機、記録。DEMO の数値。箱が配線されるまで LIVE は空。",
    liveLead: "LIVE — この装備にコンテナ遥測はありません。演習は DEMO へ。",
    kitTitle: "計測キット",
    kitLead: "レーダー種別、水中センサ、無線、通信経路。AGRON 1 に供給。",
    kinds: { radar: "レーダー", underwater: "水中", rf: "RF / 無線", comms: "通信" },
    status: {
      watching: "監視中",
      standby: "待機",
      degraded: "低下",
      offline: "切断",
      dark: "暗",
    },
    sections: {
      container: "コンテナ",
      power: "電源",
      cooling: "冷却",
      sensors: "センサ",
      comms: "通信",
      compute: "計算機",
      storage: "保管 / BLACK BOX",
    },
    tones: { ok: "正常", warn: "注意", fail: "故障", dark: "暗" },
  },
  he: {
    viewGroup: "מסך AGRON 1",
    watch: "WATCH",
    plant: "ניטור",
    plantLead:
      "מתקן מכולת AGRON — חשמל, אקלים, מחשבים ורשם. מספרי DEMO. LIVE ריק עד שהארגז מחובר.",
    liveLead: "LIVE — אין טלמטריה של המכולה בהתקנה הזו. עבור ל-DEMO לתרגול.",
    kitTitle: "ערכה מדידה",
    kitLead: "סוגי מכ\"ם, חיישנים תת-מימיים, רדיו ונתיבי קשר שמזינים את AGRON 1.",
    kinds: { radar: "מכ\"ם", underwater: "תת-מימי", rf: "RF / רדיו", comms: "קשר" },
    status: {
      watching: "צופה",
      standby: "המתנה",
      degraded: "ירידה",
      offline: "מנותק",
      dark: "חשוך",
    },
    sections: {
      container: "מכולה",
      power: "חשמל",
      cooling: "קירור",
      sensors: "חיישנים",
      comms: "קשר",
      compute: "מחשבים",
      storage: "אחסון / BLACK BOX",
    },
    tones: { ok: "תקין", warn: "אזהרה", fail: "תקלה", dark: "חשוך" },
  },
};

export function plantCopy(locale: Locale): PlantCopy {
  return COPY[locale] ?? COPY.en;
}
