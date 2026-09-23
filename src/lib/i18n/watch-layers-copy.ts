import type { Locale } from "@/lib/i18n/locales";
import type { LayerId, LayerStatus } from "@/lib/watch-layers";

export type WatchLayersCopy = {
  detectTitle: string;
  detectLead: string;
  geoTitle: string;
  geoLead: string;
  routeTitle: string;
  routeLead: string;
  analyticsTitle: string;
  analyticsLead: string;
  functionsLater: string;
  liveEmpty: string;
  noTrack: string;
  layers: Record<LayerId, { name: string; role: string }>;
  status: Record<LayerStatus, string>;
};

const COPY: Record<Locale, WatchLayersCopy> = {
  en: {
    detectTitle: "Detection and protection",
    detectLead:
      "Stations for finding a threat and answering it. Functions of each station will be specified next.",
    geoTitle: "Geoinformation centre",
    geoLead:
      "Route processing and path analytics for the track on the picture. Functions of this centre will be specified next.",
    routeTitle: "Route processing",
    routeLead: "Rebuilds the path a contact has already run.",
    analyticsTitle: "Path analytics",
    analyticsLead: "Reads CPA, motion, and the next likely leg.",
    functionsLater: "Functions of this station will be specified next.",
    liveEmpty: "LIVE — no track or effector feed on this install.",
    noTrack: "No track on the picture yet.",
    layers: {
      droneIntercept: { name: "Drone intercept", role: "Air picture — small UAS" },
      pulseCannon: { name: "Pulse cannon", role: "Directed energy — pulse" },
      laser: { name: "Laser", role: "Directed energy — beam" },
      antiAir: { name: "Anti-air defense", role: "Air picture — larger tracks" },
      antiSub: { name: "Anti-subsurface defense", role: "Underwater picture" },
      elint: { name: "Radio-electronic intelligence", role: "Spectrum and emitters" },
    },
    status: { ready: "READY", standby: "STANDBY", attention: "ATTENTION", dark: "DARK" },
  },
  ru: {
    detectTitle: "Обнаружение и защита",
    detectLead:
      "Посты поиска угрозы и ответа на неё. Функции каждой секции опишем следующим шагом.",
    geoTitle: "Геоинформационный центр",
    geoLead:
      "Обработка пути следования и аналитика пути по контакту на картине. Функции центра опишем следующим шагом.",
    routeTitle: "Обработка пути следования",
    routeLead: "Собирает уже пройденный путь контакта.",
    analyticsTitle: "Аналитика пути следования",
    analyticsLead: "Смотрит CPA, движение и вероятное следующее плечо.",
    functionsLater: "Функции этой секции опишем следующим шагом.",
    liveEmpty: "LIVE — на этой установке нет трека и нет канала эффекторов.",
    noTrack: "На картине пока нет трека.",
    layers: {
      droneIntercept: { name: "Перехват дронов", role: "Воздушная картина — малые БВС" },
      pulseCannon: { name: "Импульсная пушка", role: "Направленная энергия — импульс" },
      laser: { name: "Лазер", role: "Направленная энергия — луч" },
      antiAir: { name: "Противовоздушная оборона", role: "Воздушная картина — крупные треки" },
      antiSub: { name: "Противоподводная оборона", role: "Подводная картина" },
      elint: { name: "Радиоэлектронная разведка", role: "Спектр и излучатели" },
    },
    status: { ready: "ГОТОВ", standby: "ДЕЖУРНЫЙ", attention: "ВНИМАНИЕ", dark: "ТЕМНО" },
  },
  uk: {
    detectTitle: "Виявлення і захист",
    detectLead:
      "Пости пошуку загрози та відповіді. Функції кожної секції опишемо наступним кроком.",
    geoTitle: "Геоінформаційний центр",
    geoLead:
      "Обробка шляху прямування й аналітика шляху за контактом на картині. Функції центру — наступним кроком.",
    routeTitle: "Обробка шляху прямування",
    routeLead: "Збирає вже пройдений шлях контакту.",
    analyticsTitle: "Аналітика шляху прямування",
    analyticsLead: "Дивиться CPA, рух і ймовірне наступне плече.",
    functionsLater: "Функції цієї секції опишемо наступним кроком.",
    liveEmpty: "LIVE — на цій установці немає треку й каналу ефекторів.",
    noTrack: "На картині ще немає треку.",
    layers: {
      droneIntercept: { name: "Перехоплення дронів", role: "Повітряна картина — малі БпЛА" },
      pulseCannon: { name: "Імпульсна гармата", role: "Спрямована енергія — імпульс" },
      laser: { name: "Лазер", role: "Спрямована енергія — промінь" },
      antiAir: { name: "Протиповітряна оборона", role: "Повітряна картина — великі треки" },
      antiSub: { name: "Протипідводна оборона", role: "Підводна картина" },
      elint: { name: "Радіоелектронна розвідка", role: "Спектр і випромінювачі" },
    },
    status: { ready: "ГОТОВИЙ", standby: "ЧЕРГОВИЙ", attention: "УВАГА", dark: "ТЕМНО" },
  },
  es: {
    detectTitle: "Detección y protección",
    detectLead:
      "Puestos para hallar una amenaza y responder. Las funciones de cada estación se precisarán a continuación.",
    geoTitle: "Centro de geoinformación",
    geoLead:
      "Proceso de ruta y analítica del trayecto del contacto en el cuadro. Las funciones del centro se precisarán a continuación.",
    routeTitle: "Proceso de ruta",
    routeLead: "Reconstruye el trayecto ya recorrido.",
    analyticsTitle: "Analítica del trayecto",
    analyticsLead: "Lee CPA, movimiento y el tramo probable.",
    functionsLater: "Las funciones de esta estación se precisarán a continuación.",
    liveEmpty: "LIVE — no hay pista ni canal de efectores en esta instalación.",
    noTrack: "Aún no hay pista en el cuadro.",
    layers: {
      droneIntercept: { name: "Interceptación de drones", role: "Cuadro aéreo — UAS pequeños" },
      pulseCannon: { name: "Cañón de pulso", role: "Energía dirigida — pulso" },
      laser: { name: "Láser", role: "Energía dirigida — haz" },
      antiAir: { name: "Defensa antiaérea", role: "Cuadro aéreo — pistas mayores" },
      antiSub: { name: "Defensa antisubmarina", role: "Cuadro submarino" },
      elint: { name: "Inteligencia radioelectrónica", role: "Espectro y emisores" },
    },
    status: { ready: "LISTO", standby: "EN GUARDIA", attention: "ATENCIÓN", dark: "OSCURO" },
  },
  fr: {
    detectTitle: "Détection et protection",
    detectLead:
      "Postes pour trouver une menace et y répondre. Les fonctions de chaque poste seront précisées ensuite.",
    geoTitle: "Centre de géoinformation",
    geoLead:
      "Traitement de route et analyse du trajet du contact sur le tableau. Les fonctions du centre seront précisées ensuite.",
    routeTitle: "Traitement de route",
    routeLead: "Reconstitue le trajet déjà parcouru.",
    analyticsTitle: "Analyse du trajet",
    analyticsLead: "Lit le CPA, le mouvement et le prochain segment probable.",
    functionsLater: "Les fonctions de ce poste seront précisées ensuite.",
    liveEmpty: "LIVE — pas de piste ni de voie d’effecteurs sur cette installation.",
    noTrack: "Pas encore de piste sur le tableau.",
    layers: {
      droneIntercept: { name: "Interception de drones", role: "Tableau aérien — petits UAS" },
      pulseCannon: { name: "Canon à impulsions", role: "Énergie dirigée — impulsion" },
      laser: { name: "Laser", role: "Énergie dirigée — faisceau" },
      antiAir: { name: "Défense antiaérienne", role: "Tableau aérien — pistes plus grandes" },
      antiSub: { name: "Défense anti-sous-marine", role: "Tableau sous-marin" },
      elint: { name: "Renseignement radioélectronique", role: "Spectre et émetteurs" },
    },
    status: { ready: "PRÊT", standby: "DE QUART", attention: "ATTENTION", dark: "SOMBRE" },
  },
  de: {
    detectTitle: "Ortung und Schutz",
    detectLead:
      "Posten, um eine Bedrohung zu finden und zu beantworten. Die Funktionen jeder Station folgen als Nächstes.",
    geoTitle: "Geoinformationszentrum",
    geoLead:
      "Routenverarbeitung und Pfadanalyse zum Kontakt im Lagebild. Die Funktionen des Zentrums folgen als Nächstes.",
    routeTitle: "Routenverarbeitung",
    routeLead: "Setzt den bereits gelaufenen Pfad zusammen.",
    analyticsTitle: "Pfadanalyse",
    analyticsLead: "Liest CPA, Bewegung und das nächste wahrscheinliche Stück.",
    functionsLater: "Die Funktionen dieser Station folgen als Nächstes.",
    liveEmpty: "LIVE — keine Spur und kein Effektor-Kanal auf dieser Anlage.",
    noTrack: "Noch keine Spur im Lagebild.",
    layers: {
      droneIntercept: { name: "Drohnenabfang", role: "Luftlage — kleine UAS" },
      pulseCannon: { name: "Impulskanone", role: "Gerichtete Energie — Impuls" },
      laser: { name: "Laser", role: "Gerichtete Energie — Strahl" },
      antiAir: { name: "Flugabwehr", role: "Luftlage — größere Spuren" },
      antiSub: { name: "U-Boot-Abwehr", role: "Unterwasserlage" },
      elint: { name: "Funktechnische Aufklärung", role: "Spektrum und Emitter" },
    },
    status: { ready: "BEREIT", standby: "WACHE", attention: "ACHTUNG", dark: "DUNKEL" },
  },
  ar: {
    detectTitle: "الكشف والحماية",
    detectLead: "محطات لإيجاد التهديد والرد عليه. وظائف كل قسم تُحدَّد في الخطوة التالية.",
    geoTitle: "مركز المعلومات الجغرافية",
    geoLead:
      "معالجة مسار السير وتحليل المسار لجهة الاتصال في الصورة. وظائف المركز في الخطوة التالية.",
    routeTitle: "معالجة مسار السير",
    routeLead: "يعيد بناء المسار الذي قطعته الجهة.",
    analyticsTitle: "تحليل المسار",
    analyticsLead: "يقرأ CPA والحركة والساق التالية المحتملة.",
    functionsLater: "وظائف هذا القسم تُحدَّد في الخطوة التالية.",
    liveEmpty: "LIVE — لا مسار ولا قناة مؤثرات على هذا التركيب.",
    noTrack: "لا مسار على الصورة بعد.",
    layers: {
      droneIntercept: { name: "اعتراض المسيّرات", role: "الصورة الجوية — مسيرات صغيرة" },
      pulseCannon: { name: "مدفع نبضي", role: "طاقة موجّهة — نبضة" },
      laser: { name: "ليزر", role: "طاقة موجّهة — شعاع" },
      antiAir: { name: "الدفاع الجوي", role: "الصورة الجوية — مسارات أكبر" },
      antiSub: { name: "الدفاع ضد الغواصات", role: "الصورة تحت الماء" },
      elint: { name: "الاستطلاع الراديو إلكتروني", role: "الطيف والمشعات" },
    },
    status: { ready: "جاهز", standby: "نوبة", attention: "انتباه", dark: "مظلم" },
  },
  zh: {
    detectTitle: "探测与防护",
    detectLead: "用于发现威胁并作出应答的岗位。各站功能下一步再写明。",
    geoTitle: "地理信息中心",
    geoLead: "对画面上目标的航路处理与路径分析。中心功能下一步再写明。",
    routeTitle: "航路处理",
    routeLead: "重建目标已走过的路径。",
    analyticsTitle: "路径分析",
    analyticsLead: "读取 CPA、运动与下一可能航段。",
    functionsLater: "本站功能下一步再写明。",
    liveEmpty: "LIVE — 本安装没有航迹，也没有效应器通道。",
    noTrack: "画面上尚无航迹。",
    layers: {
      droneIntercept: { name: "无人机拦截", role: "空情 — 小型无人机" },
      pulseCannon: { name: "脉冲炮", role: "定向能 — 脉冲" },
      laser: { name: "激光", role: "定向能 — 光束" },
      antiAir: { name: "防空", role: "空情 — 较大航迹" },
      antiSub: { name: "反潜防护", role: "水下态势" },
      elint: { name: "无线电电子侦察", role: "频谱与辐射源" },
    },
    status: { ready: "就绪", standby: "值班", attention: "注意", dark: "无数据" },
  },
  ja: {
    detectTitle: "探知と防護",
    detectLead: "脅威を見つけ、応えるための部署。各部署の機能は次に定めます。",
    geoTitle: "地理情報センター",
    geoLead: "画面上の物標の航路処理と経路分析。センターの機能は次に定めます。",
    routeTitle: "航路処理",
    routeLead: "すでに走った経路を組み立てます。",
    analyticsTitle: "経路分析",
    analyticsLead: "CPA、動き、次にありそうな脚を読みます。",
    functionsLater: "この部署の機能は次に定めます。",
    liveEmpty: "LIVE — この装備に航跡もエフェクタ回線もありません。",
    noTrack: "画面にまだ航跡がありません。",
    layers: {
      droneIntercept: { name: "無人機迎撃", role: "空中絵 — 小型 UAS" },
      pulseCannon: { name: "パルス砲", role: "指向性エネルギー — パルス" },
      laser: { name: "レーザー", role: "指向性エネルギー — ビーム" },
      antiAir: { name: "対空防衛", role: "空中絵 — より大きい航跡" },
      antiSub: { name: "対潜防衛", role: "水中絵" },
      elint: { name: "電波電子偵察", role: "スペクトルと放射源" },
    },
    status: { ready: "準備", standby: "当直", attention: "注意", dark: "暗" },
  },
  he: {
    detectTitle: "גילוי והגנה",
    detectLead: "עמדות לאיתור איום ולמענה. הפונקציות של כל מדור יוגדרו בשלב הבא.",
    geoTitle: "מרכז מידע גיאוגרפי",
    geoLead: "עיבוד נתיב וניתוח מסלול למגע בתמונה. פונקציות המרכז בשלב הבא.",
    routeTitle: "עיבוד נתיב",
    routeLead: "מרכיב את המסלול שכבר נסע.",
    analyticsTitle: "ניתוח מסלול",
    analyticsLead: "קורא CPA, תנועה ואת הרגל הסבירה הבאה.",
    functionsLater: "הפונקציות של מדור זה יוגדרו בשלב הבא.",
    liveEmpty: "LIVE — אין מסלול ואין ערוץ אפקטורים בהתקנה הזו.",
    noTrack: "עדיין אין מסלול בתמונה.",
    layers: {
      droneIntercept: { name: "יירוט רחפנים", role: "תמונת אוויר — כטב״מים קטנים" },
      pulseCannon: { name: "תותח פולסים", role: "אנרגיה מכוונת — פולס" },
      laser: { name: "לייזר", role: "אנרגיה מכוונת — קרן" },
      antiAir: { name: "הגנה נגד־אוויר", role: "תמונת אוויר — מסלולים גדולים יותר" },
      antiSub: { name: "הגנה נגד־צוללות", role: "תמונה תת־מימית" },
      elint: { name: "מודיעין רדיו־אלקטרוני", role: "ספקטרום ופולטים" },
    },
    status: { ready: "מוכן", standby: "משמרת", attention: "תשומת לב", dark: "חשוך" },
  },
};

export function watchLayersCopy(locale: Locale): WatchLayersCopy {
  return COPY[locale] ?? COPY.en;
}
