import type { Locale } from "@/lib/i18n/locales";
import type { LayerId, LayerStatus } from "@/lib/watch-layers";

export type LayerLine = { name: string; role: string; action: string };

export type WatchLayersCopy = {
  detectTitle: string;
  detectLead: string;
  geoTitle: string;
  geoLead: string;
  routeTitle: string;
  routeLead: string;
  routeAction: string;
  analyticsTitle: string;
  analyticsLead: string;
  analyticsAction: string;
  liveEmpty: string;
  noTrack: string;
  onPicture: string;
  boundNone: string;
  layers: Record<LayerId, LayerLine>;
  status: Record<LayerStatus, string>;
};

const COPY: Record<Locale, WatchLayersCopy> = {
  en: {
    detectTitle: "Detection and protection",
    detectLead:
      "Each station works the same picture as the radar. Click a station to mark its tracks on the PPI.",
    geoTitle: "Geoinformation centre",
    geoLead:
      "Reads the selected track on the radar: the path already run, and the next likely leg.",
    routeTitle: "Route processing",
    routeLead: "Rebuilds the run from own ship to the contact.",
    routeAction:
      "Takes range, bearing, course and speed from the picture and draws the path the contact has already flown or steamed.",
    analyticsTitle: "Path analytics",
    analyticsLead: "Projects CPA, TCPA and the next leg.",
    analyticsAction:
      "Uses the same track to say how close it will pass, when, and whether it is holding, orbiting or closing.",
    liveEmpty: "LIVE — no track or effector feed on this install.",
    noTrack: "No track on the picture yet.",
    onPicture: "On the picture",
    boundNone: "No matching track on this picture.",
    layers: {
      droneIntercept: {
        name: "Drone intercept",
        role: "Close box on a small UAS",
        action:
          "Locks the small unmanned track on the PPI, holds a tight box, and offers a close-range intercept.",
      },
      pulseCannon: {
        name: "Pulse cannon",
        role: "Pulsed energy on the bearing",
        action:
          "Puts a pulsed energy lobe on the same bearing as the air track to break payload or the control link.",
      },
      laser: {
        name: "Laser",
        role: "Beam on the held track",
        action:
          "Lays a beam along the radar bearing to dazzle or burn optics on a track that is already held.",
      },
      antiAir: {
        name: "Anti-air defense",
        role: "Larger air tracks and corridors",
        action:
          "Watches air tracks that grow beyond a small UAS and opens a hard-kill corridor if a second air contact appears.",
      },
      antiSub: {
        name: "Anti-subsurface defense",
        role: "Sonar track and hull barrier",
        action:
          "Holds the underwater picture — depth, CPA to the hull — and raises a barrier if a UUV or diver closes.",
      },
      elint: {
        name: "Radio-electronic intelligence",
        role: "Emitters on the same bearing",
        action:
          "Reads the control link, jam or spoof on the picture and marks that RF on the same bearing as the track.",
      },
    },
    status: { ready: "READY", standby: "STANDBY", attention: "ATTENTION", dark: "DARK" },
  },
  ru: {
    detectTitle: "Обнаружение и защита",
    detectLead:
      "Каждый пост работает с той же картиной, что и радар. Нажмите пост — его треки подсветятся на PPI.",
    geoTitle: "Геоинформационный центр",
    geoLead:
      "Читает выбранный трек на радаре: уже пройденный путь и вероятное следующее плечо.",
    routeTitle: "Обработка пути следования",
    routeLead: "Собирает путь от своего корабля до контакта.",
    routeAction:
      "Берёт дальность, пеленг, курс и скорость с картины и рисует путь, который контакт уже прошёл.",
    analyticsTitle: "Аналитика пути следования",
    analyticsLead: "Считает CPA, TCPA и следующее плечо.",
    analyticsAction:
      "По тому же треку говорит, насколько близко пройдёт, когда, и держит ли он место, орбиту или сближение.",
    liveEmpty: "LIVE — на этой установке нет трека и нет канала эффекторов.",
    noTrack: "На картине пока нет трека.",
    onPicture: "На картине",
    boundNone: "На этой картине нет подходящего трека.",
    layers: {
      droneIntercept: {
        name: "Перехват дронов",
        role: "Тесный бокс на малом БВС",
        action:
          "Берёт малый беспилотный трек на PPI, держит тесный бокс и предлагает перехват на малой дистанции.",
      },
      pulseCannon: {
        name: "Импульсная пушка",
        role: "Импульс на пеленге трека",
        action:
          "Ставит импульсный лепесток на тот же пеленг, что воздушный трек, чтобы сорвать полезную нагрузку или канал управления.",
      },
      laser: {
        name: "Лазер",
        role: "Луч по удержанному треку",
        action:
          "Кладёт луч вдоль пеленга радара, чтобы засветить или выжечь оптику уже удержанного трека.",
      },
      antiAir: {
        name: "Противовоздушная оборона",
        role: "Крупные воздушные треки",
        action:
          "Следит за воздушными треками крупнее малого БВС и открывает коридор поражения, если появляется второй воздушный контакт.",
      },
      antiSub: {
        name: "Противоподводная оборона",
        role: "Гидроакустика и барьер у корпуса",
        action:
          "Держит подводную картину — глубину, CPA к корпусу — и поднимает барьер, если УУВ или пловец сближается.",
      },
      elint: {
        name: "Радиоэлектронная разведка",
        role: "Излучатели на том же пеленге",
        action:
          "Читает канал управления, помеху или подмену на картине и ставит это РЭ на тот же пеленг, что трек.",
      },
    },
    status: { ready: "ГОТОВ", standby: "ДЕЖУРНЫЙ", attention: "ВНИМАНИЕ", dark: "ТЕМНО" },
  },
  uk: {
    detectTitle: "Виявлення і захист",
    detectLead:
      "Кожен пост працює з тією самою картиною, що й радар. Натисніть пост — його треки підсвітяться на PPI.",
    geoTitle: "Геоінформаційний центр",
    geoLead: "Читає вибраний трек на радарі: вже пройдений шлях і ймовірне наступне плече.",
    routeTitle: "Обробка шляху прямування",
    routeLead: "Збирає шлях від свого корабля до контакту.",
    routeAction:
      "Бере дальність, пеленг, курс і швидкість з картини й малює шлях, який контакт уже пройшов.",
    analyticsTitle: "Аналітика шляху прямування",
    analyticsLead: "Рахує CPA, TCPA і наступне плече.",
    analyticsAction:
      "За тим самим треком каже, наскільки близько пройде, коли, і чи тримає місце, орбіту або зближення.",
    liveEmpty: "LIVE — на цій установці немає треку й каналу ефекторів.",
    noTrack: "На картині ще немає треку.",
    onPicture: "На картині",
    boundNone: "На цій картині немає відповідного треку.",
    layers: {
      droneIntercept: {
        name: "Перехоплення дронів",
        role: "Тісний бокс на малому БпЛА",
        action: "Бере малий безпілотний трек на PPI, тримає тісний бокс і пропонує перехоплення зблизька.",
      },
      pulseCannon: {
        name: "Імпульсна гармата",
        role: "Імпульс на пеленгу треку",
        action: "Ставить імпульсний пелюсток на той самий пеленг, що повітряний трек.",
      },
      laser: {
        name: "Лазер",
        role: "Промінь по утриманому треку",
        action: "Кладе промінь уздовж пеленгу радара, щоб засвітити оптику вже утриманого треку.",
      },
      antiAir: {
        name: "Протиповітряна оборона",
        role: "Великі повітряні треки",
        action: "Стежить за повітряними треками більшими за малий БпЛА і відкриває коридор ураження.",
      },
      antiSub: {
        name: "Протипідводна оборона",
        role: "Гідроакустика і бар’єр біля корпусу",
        action: "Тримає підводну картину і піднімає бар’єр, якщо UUV або плавець зближається.",
      },
      elint: {
        name: "Радіоелектронна розвідка",
        role: "Випромінювачі на тому самому пеленгу",
        action: "Читає канал керування, заваду чи підміну на картині і ставить це РЕ на пеленг треку.",
      },
    },
    status: { ready: "ГОТОВИЙ", standby: "ЧЕРГОВИЙ", attention: "УВАГА", dark: "ТЕМНО" },
  },
  es: {
    detectTitle: "Detección y protección",
    detectLead:
      "Cada puesto trabaja el mismo cuadro que el radar. Pulse un puesto para marcar sus pistas en el PPI.",
    geoTitle: "Centro de geoinformación",
    geoLead: "Lee la pista elegida en el radar: el trayecto ya recorrido y el tramo probable.",
    routeTitle: "Proceso de ruta",
    routeLead: "Reconstruye el trayecto desde el propio buque hasta el contacto.",
    routeAction:
      "Toma distancia, demora, rumbo y velocidad del cuadro y dibuja el camino ya recorrido.",
    analyticsTitle: "Analítica del trayecto",
    analyticsLead: "Proyecta CPA, TCPA y el siguiente tramo.",
    analyticsAction:
      "Con la misma pista dice lo cerca que pasará, cuándo, y si mantiene, orbita o cierra.",
    liveEmpty: "LIVE — no hay pista ni canal de efectores en esta instalación.",
    noTrack: "Aún no hay pista en el cuadro.",
    onPicture: "En el cuadro",
    boundNone: "No hay pista que coincida en este cuadro.",
    layers: {
      droneIntercept: {
        name: "Interceptación de drones",
        role: "Caja estrecha sobre un UAS pequeño",
        action: "Toma la pista no tripulada pequeña en el PPI, mantiene una caja estrecha y ofrece un intercepto cercano.",
      },
      pulseCannon: {
        name: "Cañón de pulso",
        role: "Energía pulsada en la demora",
        action: "Pone un lóbulo pulsado en la misma demora que la pista aérea.",
      },
      laser: {
        name: "Láser",
        role: "Haz sobre la pista retenida",
        action: "Tiende un haz a lo largo de la demora del radar para cegar la óptica de una pista ya retenida.",
      },
      antiAir: {
        name: "Defensa antiaérea",
        role: "Pistas aéreas mayores",
        action: "Vigila pistas aéreas mayores que un UAS pequeño y abre un corredor si aparece un segundo contacto aéreo.",
      },
      antiSub: {
        name: "Defensa antisubmarina",
        role: "Pista de sonar y barrera al casco",
        action: "Sostiene el cuadro submarino y alza una barrera si un UUV o un buzo cierra.",
      },
      elint: {
        name: "Inteligencia radioelectrónica",
        role: "Emisores en la misma demora",
        action: "Lee el enlace de control, el bloqueo o la suplantación y lo marca en la misma demora que la pista.",
      },
    },
    status: { ready: "LISTO", standby: "EN GUARDIA", attention: "ATENCIÓN", dark: "OSCURO" },
  },
  fr: {
    detectTitle: "Détection et protection",
    detectLead:
      "Chaque poste travaille le même tableau que le radar. Cliquez un poste pour marquer ses pistes sur le PPI.",
    geoTitle: "Centre de géoinformation",
    geoLead: "Lit la piste choisie sur le radar : le trajet déjà parcouru et le prochain segment probable.",
    routeTitle: "Traitement de route",
    routeLead: "Reconstitue le trajet du navire au contact.",
    routeAction:
      "Prend distance, relevé, cap et vitesse sur le tableau et trace le chemin déjà parcouru.",
    analyticsTitle: "Analyse du trajet",
    analyticsLead: "Projette CPA, TCPA et le prochain segment.",
    analyticsAction:
      "Sur la même piste dit de combien elle passera, quand, et si elle tient, orbite ou se rapproche.",
    liveEmpty: "LIVE — pas de piste ni de voie d’effecteurs sur cette installation.",
    noTrack: "Pas encore de piste sur le tableau.",
    onPicture: "Sur le tableau",
    boundNone: "Aucune piste correspondante sur ce tableau.",
    layers: {
      droneIntercept: {
        name: "Interception de drones",
        role: "Boîte serrée sur un petit UAS",
        action: "Prend la petite piste sans pilote sur le PPI, tient une boîte serrée et propose un intercept à courte distance.",
      },
      pulseCannon: {
        name: "Canon à impulsions",
        role: "Énergie pulsée sur le relevé",
        action: "Place un lobe pulsé sur le même relevé que la piste aérienne.",
      },
      laser: {
        name: "Laser",
        role: "Faisceau sur la piste tenue",
        action: "Pose un faisceau le long du relevé radar pour éblouir l’optique d’une piste déjà tenue.",
      },
      antiAir: {
        name: "Défense antiaérienne",
        role: "Pistes aériennes plus grandes",
        action: "Surveille les pistes aériennes plus grandes qu’un petit UAS et ouvre un couloir si un second contact aérien apparaît.",
      },
      antiSub: {
        name: "Défense anti-sous-marine",
        role: "Piste sonar et barrière à coque",
        action: "Tient le tableau sous-marin et lève une barrière si un UUV ou un plongeur se rapproche.",
      },
      elint: {
        name: "Renseignement radioélectronique",
        role: "Émetteurs sur le même relevé",
        action: "Lit la liaison de conduite, le brouillage ou l’usurpation et le marque sur le même relevé que la piste.",
      },
    },
    status: { ready: "PRÊT", standby: "DE QUART", attention: "ATTENTION", dark: "SOMBRE" },
  },
  de: {
    detectTitle: "Ortung und Schutz",
    detectLead:
      "Jeder Posten arbeitet dasselbe Lagebild wie das Radar. Klick markiert seine Spuren auf dem PPI.",
    geoTitle: "Geoinformationszentrum",
    geoLead: "Liest die gewählte Spur auf dem Radar: bereits gelaufener Pfad und nächstes Stück.",
    routeTitle: "Routenverarbeitung",
    routeLead: "Setzt den Lauf vom eigenen Schiff zum Kontakt zusammen.",
    routeAction:
      "Nimmt Distanz, Peilung, Kurs und Fahrt aus dem Lagebild und zeichnet den bereits gelaufenen Pfad.",
    analyticsTitle: "Pfadanalyse",
    analyticsLead: "Projiziert CPA, TCPA und das nächste Stück.",
    analyticsAction:
      "Sagt an derselben Spur, wie nah sie passiert, wann, und ob sie hält, kreist oder schließt.",
    liveEmpty: "LIVE — keine Spur und kein Effektor-Kanal auf dieser Anlage.",
    noTrack: "Noch keine Spur im Lagebild.",
    onPicture: "Im Lagebild",
    boundNone: "Keine passende Spur in diesem Lagebild.",
    layers: {
      droneIntercept: {
        name: "Drohnenabfang",
        role: "Enge Box auf kleinem UAS",
        action: "Nimmt die kleine unbemannte Spur auf dem PPI, hält eine enge Box und bietet einen Nahabfang.",
      },
      pulseCannon: {
        name: "Impulskanone",
        role: "Impuls auf der Peilung",
        action: "Setzt einen Impulslappen auf dieselbe Peilung wie die Luftspur.",
      },
      laser: {
        name: "Laser",
        role: "Strahl auf gehaltener Spur",
        action: "Legt einen Strahl entlang der Radarpeilung, um Optik einer schon gehaltenen Spur zu blenden.",
      },
      antiAir: {
        name: "Flugabwehr",
        role: "Größere Luftspuren",
        action: "Wacht über Luftspuren größer als ein kleines UAS und öffnet einen Korridor, wenn ein zweiter Luftkontakt erscheint.",
      },
      antiSub: {
        name: "U-Boot-Abwehr",
        role: "Sonarspur und Rumpfbarriere",
        action: "Hält das Unterwasserlagebild und hebt eine Barriere, wenn ein UUV oder Taucher schließt.",
      },
      elint: {
        name: "Funktechnische Aufklärung",
        role: "Emitter auf derselben Peilung",
        action: "Liest Steuerlink, Störung oder Täuschung und setzt sie auf dieselbe Peilung wie die Spur.",
      },
    },
    status: { ready: "BEREIT", standby: "WACHE", attention: "ACHTUNG", dark: "DUNKEL" },
  },
  ar: {
    detectTitle: "الكشف والحماية",
    detectLead: "كل محطة تعمل على الصورة نفسها التي يعمل عليها الرادار. اضغط المحطة لتحديد مساراتها على PPI.",
    geoTitle: "مركز المعلومات الجغرافية",
    geoLead: "يقرأ المسار المختار على الرادار: الطريق المقطوع والساق التالية المحتملة.",
    routeTitle: "معالجة مسار السير",
    routeLead: "يعيد بناء المسار من السفينة إلى جهة الاتصال.",
    routeAction: "يأخذ المدى والسمت والمسار والسرعة من الصورة ويرسم الطريق الذي قطعته الجهة.",
    analyticsTitle: "تحليل المسار",
    analyticsLead: "يسقط CPA وTCPA والساق التالية.",
    analyticsAction: "يقول على المسار نفسه مدى القرب ومتى، وهل يثبت أو يدور أو يقترب.",
    liveEmpty: "LIVE — لا مسار ولا قناة مؤثرات على هذا التركيب.",
    noTrack: "لا مسار على الصورة بعد.",
    onPicture: "على الصورة",
    boundNone: "لا مسار مطابق على هذه الصورة.",
    layers: {
      droneIntercept: {
        name: "اعتراض المسيّرات",
        role: "صندوق ضيق على مسيّرة صغيرة",
        action: "يلتقط المسار الصغير بلا طيار على PPI ويمسك صندوقًا ضيقًا ويعرض اعتراضًا قريبًا.",
      },
      pulseCannon: {
        name: "مدفع نبضي",
        role: "نبضة على سمت المسار",
        action: "يضع فصًّا نبضيًا على السمت نفسه الذي للمسار الجوي.",
      },
      laser: {
        name: "ليزر",
        role: "شعاع على المسار الممسوك",
        action: "يضع شعاعًا على سمت الرادار لإبهار بصريات مسار ممسوك.",
      },
      antiAir: {
        name: "الدفاع الجوي",
        role: "مسارات جوية أكبر",
        action: "يراقب المسارات الجوية الأكبر من مسيّرة صغيرة ويفتح ممرًا إذا ظهر اتصال جوي ثان.",
      },
      antiSub: {
        name: "الدفاع ضد الغواصات",
        role: "مسار سونار وحاجز عند الهيكل",
        action: "يمسك الصورة تحت الماء ويرفع حاجزًا إذا اقترب UUV أو غواص.",
      },
      elint: {
        name: "الاستطلاع الراديو إلكتروني",
        role: "مشعات على السمت نفسه",
        action: "يقرأ وصلة التحكم أو التشويش أو التزييف ويعلّمها على سمت المسار.",
      },
    },
    status: { ready: "جاهز", standby: "نوبة", attention: "انتباه", dark: "مظلم" },
  },
  zh: {
    detectTitle: "探测与防护",
    detectLead: "每个岗位使用与雷达同一幅画面。点岗位，PPI 上标出它的航迹。",
    geoTitle: "地理信息中心",
    geoLead: "读取雷达上所选航迹：已走路径与下一可能航段。",
    routeTitle: "航路处理",
    routeLead: "从本船到目标重建路径。",
    routeAction: "从画面取距离、方位、航向与速度，画出目标已走过的路。",
    analyticsTitle: "路径分析",
    analyticsLead: "推算 CPA、TCPA 与下一航段。",
    analyticsAction: "用同一航迹说明会多近、何时，以及是悬停、盘旋还是接近。",
    liveEmpty: "LIVE — 本安装没有航迹，也没有效应器通道。",
    noTrack: "画面上尚无航迹。",
    onPicture: "在画面上",
    boundNone: "此画面没有匹配航迹。",
    layers: {
      droneIntercept: {
        name: "无人机拦截",
        role: "对小型无人机收紧盒子",
        action: "在 PPI 上锁定小型无人航迹，收紧盒子，并给出近距拦截。",
      },
      pulseCannon: {
        name: "脉冲炮",
        role: "沿方位的脉冲能量",
        action: "把脉冲瓣放到与空中航迹相同的方位上。",
      },
      laser: {
        name: "激光",
        role: "对已保持航迹的光束",
        action: "沿雷达方位铺光束，眩盲或烧蚀已保持航迹的光学。",
      },
      antiAir: {
        name: "防空",
        role: "更大的空中航迹",
        action: "监视大于小型无人机的空中航迹；若出现第二个空中目标则打开杀伤走廊。",
      },
      antiSub: {
        name: "反潜防护",
        role: "声呐航迹与船体屏障",
        action: "保持水下画面；若 UUV 或潜水员接近则升起屏障。",
      },
      elint: {
        name: "无线电电子侦察",
        role: "同一方位上的辐射源",
        action: "读取画面上的控制链路、干扰或欺骗，并标在与航迹相同的方位。",
      },
    },
    status: { ready: "就绪", standby: "值班", attention: "注意", dark: "无数据" },
  },
  ja: {
    detectTitle: "探知と防護",
    detectLead: "各部署はレーダーと同じ絵を使います。部署をクリックすると PPI 上の航跡が印されます。",
    geoTitle: "地理情報センター",
    geoLead: "レーダー上の選んだ航跡を読みます。すでに走った経路と次の脚。",
    routeTitle: "航路処理",
    routeLead: "自船から物標までの経路を組み立てます。",
    routeAction: "画面の距離・方位・針路・速力を取り、すでに走った道を描きます。",
    analyticsTitle: "経路分析",
    analyticsLead: "CPA、TCPA、次の脚を出します。",
    analyticsAction: "同じ航跡で、どれだけ近くをいつ通り、保持・周回・接近のどれかを言います。",
    liveEmpty: "LIVE — この装備に航跡もエフェクタ回線もありません。",
    noTrack: "画面にまだ航跡がありません。",
    onPicture: "画面上",
    boundNone: "この画面に合う航跡はありません。",
    layers: {
      droneIntercept: {
        name: "無人機迎撃",
        role: "小型 UAS を狭い箱で保持",
        action: "PPI 上の小型無人航跡を取り、狭い箱で保持し、近距離の迎撃を出します。",
      },
      pulseCannon: {
        name: "パルス砲",
        role: "方位上のパルス",
        action: "空中航跡と同じ方位にパルスローブを置きます。",
      },
      laser: {
        name: "レーザー",
        role: "保持した航跡へのビーム",
        action: "レーダー方位に沿ってビームを置き、保持済み航跡の光学を眩ませます。",
      },
      antiAir: {
        name: "対空防衛",
        role: "より大きい空中航跡",
        action: "小型 UAS より大きい空中航跡を見、第二の空中物標が出れば回廊を開きます。",
      },
      antiSub: {
        name: "対潜防衛",
        role: "ソナー航跡と船体の障壁",
        action: "水中絵を保持し、UUV や潜水者が近づけば障壁を上げます。",
      },
      elint: {
        name: "電波電子偵察",
        role: "同じ方位の放射源",
        action: "画面上の管制リンク、妨害、なりすましを読み、航跡と同じ方位に印します。",
      },
    },
    status: { ready: "準備", standby: "当直", attention: "注意", dark: "暗" },
  },
  he: {
    detectTitle: "גילוי והגנה",
    detectLead: "כל עמדה עובדת על אותה תמונה כמו המכ״ם. לחצו על עמדה כדי לסמן את מסלוליה על ה־PPI.",
    geoTitle: "מרכז מידע גיאוגרפי",
    geoLead: "קורא את המסלול שנבחר במכ״ם: הדרך שכבר נסעה והרגל הבאה.",
    routeTitle: "עיבוד נתיב",
    routeLead: "מרכיב את המסלול מהספינה אל המגע.",
    routeAction: "לוקח טווח, אזימוט, נתיב ומהירות מהתמונה ומצייר את הדרך שכבר נסעה.",
    analyticsTitle: "ניתוח מסלול",
    analyticsLead: "מחשב CPA, TCPA ואת הרגל הבאה.",
    analyticsAction: "על אותו מסלול אומר כמה קרוב יעבור, מתי, ואם הוא מחזיק, מקיף או מתקרב.",
    liveEmpty: "LIVE — אין מסלול ואין ערוץ אפקטורים בהתקנה הזו.",
    noTrack: "עדיין אין מסלול בתמונה.",
    onPicture: "בתמונה",
    boundNone: "אין מסלול מתאים בתמונה הזו.",
    layers: {
      droneIntercept: {
        name: "יירוט רחפנים",
        role: "קופסה הדוקה על כטב״ם קטן",
        action: "לוקח את המסלול הבלתי מאויש הקטן על ה־PPI, מחזיק קופסה הדוקה ומציע יירוט קרוב.",
      },
      pulseCannon: {
        name: "תותח פולסים",
        role: "פולס על האזימוט",
        action: "שם אונה פועמת על אותו אזימוט כמו המסלול האווירי.",
      },
      laser: {
        name: "לייזר",
        role: "קרן על מסלול מוחזק",
        action: "מניח קרן לאורך אזימוט המכ״ם כדי לסנוור אופטיקה של מסלול שכבר מוחזק.",
      },
      antiAir: {
        name: "הגנה נגד־אוויר",
        role: "מסלולי אוויר גדולים יותר",
        action: "עוקב אחרי מסלולי אוויר גדולים מכטב״ם קטן ופותח מסדרון אם מופיע מגע אוויר שני.",
      },
      antiSub: {
        name: "הגנה נגד־צוללות",
        role: "מסלול סונאר ומחסום ליד הגוף",
        action: "מחזיק את התמונה התת־מימית ומעלה מחסום אם UUV או צולל מתקרבים.",
      },
      elint: {
        name: "מודיעין רדיו־אלקטרוני",
        role: "פולטים על אותו אזימוט",
        action: "קורא קישור שליטה, שיבוש או זיוף ומסמן אותם על אזימוט המסלול.",
      },
    },
    status: { ready: "מוכן", standby: "משמרת", attention: "תשומת לב", dark: "חשוך" },
  },
};

export function watchLayersCopy(locale: Locale): WatchLayersCopy {
  return COPY[locale] ?? COPY.en;
}
