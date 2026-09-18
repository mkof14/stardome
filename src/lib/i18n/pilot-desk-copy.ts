import type { Locale } from "@/lib/i18n/locales";

export type PilotDeskCopy = {
  post: string;
  instruments: string;
  advice: string;
  comms: string;
  alarm: string;
  remind: string;
  train: string;
  ack: string;
  ask: string;
  support: string;
  watchNet: string;
  satcom: string;
  liveEmpty: string;
  normal: string;
  fault: string;
  crisis: string;
  recommended: string;
  youDecide: string;
  closeCard: string;
  expand: string;
  collapse: string;
  notify: string;
  posted: string;
  alarmSent: string;
  standBy: string;
  picture: string;
  contacts: string;
  noContacts: string;
  channelWatch: string;
  channelSupport: string;
  channelAlarm: string;
  typeComms: string;
  sendComms: string;
  unread: string;
  seePicture: string;
  step: string;
  protocol: string;
  dismissAll: string;
  raiseInstruments: string;
  raiseAdvice: string;
  raiseComms: string;
  connected: string;
  offline: string;
  liveComms: string;
  demoComms: string;
  watching: string;
  quiet: string;
  degraded: string;
  dark: string;
  panels: {
    radar: string;
    sonar: string;
    spectrum: string;
    perimeter: string;
  };
};

const DESK = {
  en: {
    post: "ON WATCH",
    instruments: "Instruments",
    advice: "Advice",
    comms: "Comms",
    alarm: "Alarm",
    remind: "Reminder",
    train: "Standing order",
    ack: "Acknowledged",
    ask: "Ask Pilot",
    support: "Support Center",
    watchNet: "Watch net",
    satcom: "Satcom",
    liveEmpty:
      "LIVE — no sensors on this install. I have no picture to read. Switch to DEMO to drill, or ask about StarWall.",
    normal:
      "Normal watch. Radar, AIS, cameras, and perimeter are quiet. I am here if something changes.",
    fault:
      "{name} is offline. Other sensors continue. Do not treat the picture as complete.",
    crisis: "Crisis protocol is up. I can walk the steps with you. The decision stays yours.",
    recommended: "Recommended",
    youDecide: "Advice only — you decide.",
    closeCard: "Close",
    expand: "Expand",
    collapse: "Collapse",
    notify: "Notify designated person",
    posted: "Posted on the watch net.",
    alarmSent: "Alarm posted for the designated person. Confirm they have it.",
    standBy: "Pilot standing by",
    picture: "Picture",
    contacts: "Contacts",
    noContacts: "No priority contacts on this picture.",
    channelWatch: "Watch",
    channelSupport: "Support",
    channelAlarm: "Alarm",
    typeComms: "Message the watch…",
    sendComms: "Post",
    unread: "Pilot has a note for you",
    seePicture: "I am reading {panel}.",
    step: "Next step",
    protocol: "Protocol",
    dismissAll: "Clear notes",
    raiseInstruments: "Instruments",
    raiseAdvice: "Advice",
    raiseComms: "Comms",
    connected: "On the net",
    offline: "No path",
    liveComms:
      "LIVE satcom is not connected on this install. I cannot reach a real watch net yet.",
    demoComms: "DEMO watch net — people on this picture, not a live radio.",
    watching: "Watching",
    quiet: "Quiet",
    degraded: "Degraded",
    dark: "Dark",
    panels: {
      radar: "Radar",
      sonar: "Sonar",
      spectrum: "RF / spectrum",
      perimeter: "Perimeter",
    },
  },
  es: {
    post: "DE GUARDIA",
    instruments: "Instrumentos",
    advice: "Consejo",
    comms: "Comms",
    alarm: "Alarma",
    remind: "Recordatorio",
    train: "Orden de guardia",
    ack: "Enterado",
    ask: "Preguntar a Pilot",
    support: "Support Center",
    watchNet: "Red de guardia",
    satcom: "Satcom",
    liveEmpty:
      "LIVE — no hay sensores en esta instalación. No tengo imagen. Pase a DEMO para practicar, o pregunte por StarWall.",
    normal:
      "Guardia normal. Radar, AIS, cámaras y perímetro en calma. Estoy aquí si cambia algo.",
    fault:
      "{name} está fuera de línea. El resto sigue. No trate la imagen como completa.",
    crisis: "El protocolo de crisis está activo. Puedo ir paso a paso. La decisión es suya.",
    recommended: "Recomendado",
    youDecide: "Solo consejo — usted decide.",
    closeCard: "Cerrar",
    expand: "Ampliar",
    collapse: "Reducir",
    notify: "Avisar a la persona designada",
    posted: "Publicado en la red de guardia.",
    alarmSent: "Alarma enviada a la persona designada. Confirme que la tiene.",
    standBy: "Pilot a la espera",
    picture: "Imagen",
    contacts: "Contactos",
    noContacts: "No hay contactos prioritarios en esta imagen.",
    channelWatch: "Guardia",
    channelSupport: "Support",
    channelAlarm: "Alarma",
    typeComms: "Mensaje a la guardia…",
    sendComms: "Publicar",
    unread: "Pilot tiene una nota para usted",
    seePicture: "Estoy leyendo {panel}.",
    step: "Siguiente paso",
    protocol: "Protocolo",
    dismissAll: "Quitar notas",
    raiseInstruments: "Instrumentos",
    raiseAdvice: "Consejo",
    raiseComms: "Comms",
    connected: "En la red",
    offline: "Sin vía",
    liveComms:
      "LIVE: satcom no está conectado aquí. Aún no llego a una red de guardia real.",
    demoComms: "Red DEMO — gente de esta imagen, no una radio en vivo.",
    watching: "En vigilancia",
    quiet: "En calma",
    degraded: "Degradado",
    dark: "Oscuro",
    panels: {
      radar: "Radar",
      sonar: "Sonar",
      spectrum: "RF / espectro",
      perimeter: "Perímetro",
    },
  },
  fr: {
    post: "DE QUART",
    instruments: "Instruments",
    advice: "Conseil",
    comms: "Comms",
    alarm: "Alarme",
    remind: "Rappel",
    train: "Consigne de quart",
    ack: "Pris en compte",
    ask: "Demander à Pilot",
    support: "Support Center",
    watchNet: "Réseau de quart",
    satcom: "Satcom",
    liveEmpty:
      "LIVE — aucun capteur sur cette installation. Je n’ai pas d’image. Passez en DEMO pour l’exercice, ou interrogez StarWall.",
    normal:
      "Quart normal. Radar, AIS, caméras et périmètre calmes. Je suis là si ça change.",
    fault:
      "{name} est hors ligne. Les autres capteurs continuent. Ne traitez pas l’image comme complète.",
    crisis: "Le protocole de crise est ouvert. Je peux faire les étapes avec vous. La décision reste la vôtre.",
    recommended: "Recommandé",
    youDecide: "Conseil seulement — vous décidez.",
    closeCard: "Fermer",
    expand: "Agrandir",
    collapse: "Réduire",
    notify: "Prévenir la personne désignée",
    posted: "Publié sur le réseau de quart.",
    alarmSent: "Alarme envoyée à la personne désignée. Confirmez qu’elle l’a.",
    standBy: "Pilot en attente",
    picture: "Image",
    contacts: "Contacts",
    noContacts: "Pas de contacts prioritaires sur cette image.",
    channelWatch: "Quart",
    channelSupport: "Support",
    channelAlarm: "Alarme",
    typeComms: "Message au quart…",
    sendComms: "Publier",
    unread: "Pilot a une note pour vous",
    seePicture: "Je lis {panel}.",
    step: "Étape suivante",
    protocol: "Protocole",
    dismissAll: "Effacer les notes",
    raiseInstruments: "Instruments",
    raiseAdvice: "Conseil",
    raiseComms: "Comms",
    connected: "Sur le réseau",
    offline: "Pas de voie",
    liveComms:
      "LIVE : satcom n’est pas connecté ici. Je n’atteins pas encore un vrai réseau de quart.",
    demoComms: "Réseau DEMO — les gens de cette image, pas une radio réelle.",
    watching: "En veille",
    quiet: "Calme",
    degraded: "Dégradé",
    dark: "Sombre",
    panels: {
      radar: "Radar",
      sonar: "Sonar",
      spectrum: "RF / spectre",
      perimeter: "Périmètre",
    },
  },
  de: {
    post: "AUF WACHE",
    instruments: "Instrumente",
    advice: "Rat",
    comms: "Comms",
    alarm: "Alarm",
    remind: "Erinnerung",
    train: "Wachordnung",
    ack: "Zur Kenntnis",
    ask: "Pilot fragen",
    support: "Support Center",
    watchNet: "Wache-Netz",
    satcom: "Satcom",
    liveEmpty:
      "LIVE — keine Sensoren an dieser Installation. Ich habe kein Lagebild. Wechseln Sie zu DEMO zum Üben, oder fragen Sie zu StarWall.",
    normal:
      "Normale Wache. Radar, AIS, Kameras und Perimeter ruhig. Ich bin da, wenn sich etwas ändert.",
    fault:
      "{name} ist offline. Die anderen Sensoren laufen weiter. Behandeln Sie das Bild nicht als vollständig.",
    crisis: "Krisenprotokoll ist offen. Ich gehe die Schritte mit Ihnen. Die Entscheidung bleibt bei Ihnen.",
    recommended: "Empfohlen",
    youDecide: "Nur Rat — Sie entscheiden.",
    closeCard: "Schließen",
    expand: "Vergrößern",
    collapse: "Verkleinern",
    notify: "Benannte Person benachrichtigen",
    posted: "Im Wache-Netz veröffentlicht.",
    alarmSent: "Alarm an die benannte Person. Bestätigen Sie, dass sie ihn hat.",
    standBy: "Pilot bereit",
    picture: "Lagebild",
    contacts: "Kontakte",
    noContacts: "Keine vorrangigen Kontakte in diesem Bild.",
    channelWatch: "Wache",
    channelSupport: "Support",
    channelAlarm: "Alarm",
    typeComms: "Nachricht an die Wache…",
    sendComms: "Senden",
    unread: "Pilot hat eine Notiz für Sie",
    seePicture: "Ich lese {panel}.",
    step: "Nächster Schritt",
    protocol: "Protokoll",
    dismissAll: "Notizen leeren",
    raiseInstruments: "Instrumente",
    raiseAdvice: "Rat",
    raiseComms: "Comms",
    connected: "Im Netz",
    offline: "Kein Weg",
    liveComms:
      "LIVE: Satcom ist hier nicht verbunden. Ich erreiche noch kein echtes Wache-Netz.",
    demoComms: "DEMO-Netz — Personen dieses Bildes, kein Live-Funk.",
    watching: "In Beobachtung",
    quiet: "Ruhig",
    degraded: "Eingeschränkt",
    dark: "Dunkel",
    panels: {
      radar: "Radar",
      sonar: "Sonar",
      spectrum: "RF / Spektrum",
      perimeter: "Perimeter",
    },
  },
  ru: {
    post: "НА ВАХТЕ",
    instruments: "Приборы",
    advice: "Совет",
    comms: "Связь",
    alarm: "Тревога",
    remind: "Напоминание",
    train: "Вахтенный порядок",
    ack: "Принято",
    ask: "Спросить Pilot",
    support: "Support Center",
    watchNet: "Сеть вахты",
    satcom: "Satcom",
    liveEmpty:
      "LIVE — на этом развёртывании нет датчиков. Картины нет. Переключитесь в DEMO для учения или спросите про StarWall.",
    normal:
      "Обычная вахта. Радар, AIS, камеры и периметр спокойны. Я здесь, если что-то изменится.",
    fault:
      "{name} не на связи. Остальные датчики работают. Не принимайте картину за полную.",
    crisis: "Открыт кризисный протокол. Могу пройти шаги с вами. Решение за вами.",
    recommended: "Рекомендовано",
    youDecide: "Это совет — решение за вами.",
    closeCard: "Закрыть",
    expand: "Развернуть",
    collapse: "Свернуть",
    notify: "Известить назначенного",
    posted: "Опубликовано в сети вахты.",
    alarmSent: "Тревога ушла назначенному. Убедитесь, что он её видит.",
    standBy: "Pilot на посту",
    picture: "Картина",
    contacts: "Контакты",
    noContacts: "На этой картине нет приоритетных контактов.",
    channelWatch: "Вахта",
    channelSupport: "Support",
    channelAlarm: "Тревога",
    typeComms: "Сообщение вахте…",
    sendComms: "Передать",
    unread: "Pilot оставил вам записку",
    seePicture: "Читаю {panel}.",
    step: "Следующий шаг",
    protocol: "Протокол",
    dismissAll: "Снять записки",
    raiseInstruments: "Приборы",
    raiseAdvice: "Совет",
    raiseComms: "Связь",
    connected: "В сети",
    offline: "Нет канала",
    liveComms:
      "LIVE: satcom на этом развёртывании не подключён. До живой сети вахты я ещё не достаю.",
    demoComms: "Сеть DEMO — люди этой картины, не живое радио.",
    watching: "На контроле",
    quiet: "Спокойно",
    degraded: "Урезано",
    dark: "Темно",
    panels: {
      radar: "Радар",
      sonar: "Сонар",
      spectrum: "RF / спектр",
      perimeter: "Периметр",
    },
  },
  uk: {
    post: "НА ВАХТІ",
    instruments: "Прилади",
    advice: "Порада",
    comms: "Зв’язок",
    alarm: "Тривога",
    remind: "Нагадування",
    train: "Вахтовий порядок",
    ack: "Прийнято",
    ask: "Запитати Pilot",
    support: "Support Center",
    watchNet: "Мережа вахти",
    satcom: "Satcom",
    liveEmpty:
      "LIVE — на цьому розгортанні немає датчиків. Картини немає. Перемкніться в DEMO для навчання або запитайте про StarWall.",
    normal:
      "Звичайна вахта. Радар, AIS, камери й периметр спокійні. Я тут, якщо щось зміниться.",
    fault:
      "{name} поза зв’язком. Інші датчики працюють. Не беріть картину за повну.",
    crisis: "Відкрито кризовий протокол. Можу пройти кроки з вами. Рішення за вами.",
    recommended: "Рекомендовано",
    youDecide: "Це порада — рішення за вами.",
    closeCard: "Закрити",
    expand: "Розгорнути",
    collapse: "Згорнути",
    notify: "Повідомити призначеного",
    posted: "Опубліковано в мережі вахти.",
    alarmSent: "Тривога пішла призначеному. Переконайтеся, що він її бачить.",
    standBy: "Pilot на посту",
    picture: "Картина",
    contacts: "Контакти",
    noContacts: "На цій картині немає пріоритетних контактів.",
    channelWatch: "Вахта",
    channelSupport: "Support",
    channelAlarm: "Тривога",
    typeComms: "Повідомлення вахті…",
    sendComms: "Передати",
    unread: "Pilot залишив вам записку",
    seePicture: "Читаю {panel}.",
    step: "Наступний крок",
    protocol: "Протокол",
    dismissAll: "Зняти записки",
    raiseInstruments: "Прилади",
    raiseAdvice: "Порада",
    raiseComms: "Зв’язок",
    connected: "У мережі",
    offline: "Немає каналу",
    liveComms:
      "LIVE: satcom на цьому розгортанні не підключено. До живої мережі вахти я ще не сягаю.",
    demoComms: "Мережа DEMO — люди цієї картини, не живе радіо.",
    watching: "На контролі",
    quiet: "Спокійно",
    degraded: "Урізано",
    dark: "Темно",
    panels: {
      radar: "Радар",
      sonar: "Сонар",
      spectrum: "RF / спектр",
      perimeter: "Периметр",
    },
  },
  ar: {
    post: "على الخفارة",
    instruments: "الأجهزة",
    advice: "نصيحة",
    comms: "الاتصال",
    alarm: "إنذار",
    remind: "تذكير",
    train: "أمر الخفارة",
    ack: "تم الاستلام",
    ask: "اسأل Pilot",
    support: "Support Center",
    watchNet: "شبكة الخفارة",
    satcom: "Satcom",
    liveEmpty:
      "LIVE — لا مستشعرات في هذا النشر. لا صورة لدي. انتقلوا إلى DEMO للتدريب أو اسألوا عن StarWall.",
    normal:
      "خفارة عادية. الرادار وAIS والكاميرات والمحيط هادئة. أنا هنا إن تغيّر شيء.",
    fault:
      "{name} غير متصل. بقية المستشعرات تعمل. لا تعاملوا الصورة على أنها كاملة.",
    crisis: "بروتوكول الأزمة مفتوح. يمكنني السير بالخطوات معكم. القرار لكم.",
    recommended: "موصى به",
    youDecide: "نصيحة فقط — القرار لكم.",
    closeCard: "إغلاق",
    expand: "توسيع",
    collapse: "طي",
    notify: "إخطار الشخص المعيّن",
    posted: "نُشر على شبكة الخفارة.",
    alarmSent: "أُرسل الإنذار للشخص المعيّن. تأكدوا أنه رآه.",
    standBy: "Pilot في الموقع",
    picture: "الصورة",
    contacts: "جهات الاتصال",
    noContacts: "لا جهات اتصال ذات أولوية في هذه الصورة.",
    channelWatch: "الخفارة",
    channelSupport: "Support",
    channelAlarm: "إنذار",
    typeComms: "رسالة للخفارة…",
    sendComms: "إرسال",
    unread: "لدى Pilot ملاحظة لكم",
    seePicture: "أقرأ {panel}.",
    step: "الخطوة التالية",
    protocol: "البروتوكول",
    dismissAll: "مسح الملاحظات",
    raiseInstruments: "الأجهزة",
    raiseAdvice: "نصيحة",
    raiseComms: "الاتصال",
    connected: "على الشبكة",
    offline: "لا مسار",
    liveComms:
      "LIVE: satcom غير متصل هنا. لا أصل بعد إلى شبكة خفارة حقيقية.",
    demoComms: "شبكة DEMO — أشخاص هذه الصورة، ليست إذاعة حية.",
    watching: "تحت المراقبة",
    quiet: "هادئ",
    degraded: "متدهور",
    dark: "مظلم",
    panels: {
      radar: "رادار",
      sonar: "سونار",
      spectrum: "RF / طيف",
      perimeter: "محيط",
    },
  },
  zh: {
    post: "值班中",
    instruments: "仪器",
    advice: "建议",
    comms: "通信",
    alarm: "警报",
    remind: "提醒",
    train: "值班规程",
    ack: "已知悉",
    ask: "询问 Pilot",
    support: "Support Center",
    watchNet: "值班网",
    satcom: "Satcom",
    liveEmpty:
      "LIVE — 此部署没有传感器。我没有画面。切换到 DEMO 演练，或询问 StarWall。",
    normal: "正常值班。雷达、AIS、摄像机和周界平静。有变化我就在。",
    fault: "{name} 离线。其他传感器仍在工作。请勿把画面当作完整。",
    crisis: "危机规程已打开。我可以陪你走步骤。决定仍由你做出。",
    recommended: "建议",
    youDecide: "仅供建议 — 由你决定。",
    closeCard: "关闭",
    expand: "展开",
    collapse: "收起",
    notify: "通知指定人员",
    posted: "已发到值班网。",
    alarmSent: "警报已发给指定人员。请确认对方看到。",
    standBy: "Pilot 在岗",
    picture: "画面",
    contacts: "目标",
    noContacts: "此画面没有优先目标。",
    channelWatch: "值班",
    channelSupport: "Support",
    channelAlarm: "警报",
    typeComms: "给值班留言…",
    sendComms: "发送",
    unread: "Pilot 有一条给你的备注",
    seePicture: "正在读 {panel}。",
    step: "下一步",
    protocol: "规程",
    dismissAll: "清除备注",
    raiseInstruments: "仪器",
    raiseAdvice: "建议",
    raiseComms: "通信",
    connected: "在网",
    offline: "无通路",
    liveComms: "LIVE：此处未连接 satcom。我还到不了真实值班网。",
    demoComms: "DEMO 网 — 此画面中的人员，不是实况无线电。",
    watching: "监视中",
    quiet: "平静",
    degraded: "降级",
    dark: "无信号",
    panels: {
      radar: "雷达",
      sonar: "声呐",
      spectrum: "RF / 频谱",
      perimeter: "周界",
    },
  },
  ja: {
    post: "当直中",
    instruments: "計器",
    advice: "助言",
    comms: "通信",
    alarm: "警報",
    remind: "リマインダー",
    train: "当直要領",
    ack: "了解",
    ask: "Pilot に尋ねる",
    support: "Support Center",
    watchNet: "当直ネット",
    satcom: "Satcom",
    liveEmpty:
      "LIVE — この展開にセンサーはありません。画像がありません。DEMO に切り替えて訓練するか、StarWall について尋ねてください。",
    normal: "通常当直。レーダー、AIS、カメラ、周囲は静かです。変化があればここにいます。",
    fault: "{name} はオフラインです。他のセンサーは続きます。画像を完全と思わないでください。",
    crisis: "危機手順が開いています。手順を一緒に進められます。判断はあなたです。",
    recommended: "推奨",
    youDecide: "助言のみ — 判断はあなたです。",
    closeCard: "閉じる",
    expand: "拡大",
    collapse: "縮小",
    notify: "指定者に通知",
    posted: "当直ネットに投稿しました。",
    alarmSent: "指定者へ警報を送りました。届いたか確認してください。",
    standBy: "Pilot 待機",
    picture: "画面",
    contacts: "目標",
    noContacts: "この画面に優先目標はありません。",
    channelWatch: "当直",
    channelSupport: "Support",
    channelAlarm: "警報",
    typeComms: "当直へ伝言…",
    sendComms: "送信",
    unread: "Pilot からのメモがあります",
    seePicture: "{panel} を読んでいます。",
    step: "次の手順",
    protocol: "手順",
    dismissAll: "メモを消す",
    raiseInstruments: "計器",
    raiseAdvice: "助言",
    raiseComms: "通信",
    connected: "ネット上",
    offline: "経路なし",
    liveComms: "LIVE：ここでは satcom 未接続。実当直ネットにはまだ届きません。",
    demoComms: "DEMO ネット — この画面の人々であり、実況無線ではありません。",
    watching: "監視中",
    quiet: "静穏",
    degraded: "低下",
    dark: "暗転",
    panels: {
      radar: "レーダー",
      sonar: "ソナー",
      spectrum: "RF / スペクトル",
      perimeter: "周囲",
    },
  },
  he: {
    post: "במשמרת",
    instruments: "מכשירים",
    advice: "ייעוץ",
    comms: "קשר",
    alarm: "אזעקה",
    remind: "תזכורת",
    train: "סדר משמרת",
    ack: "נתקבל",
    ask: "לשאול את Pilot",
    support: "Support Center",
    watchNet: "רשת משמרת",
    satcom: "Satcom",
    liveEmpty:
      "LIVE — אין חיישנים בפריסה הזו. אין לי תמונה. עברו ל־DEMO לתרגול, או שאלו על StarWall.",
    normal: "משמרת רגילה. מכ״ם, AIS, מצלמות והיקף שקטים. אני כאן אם משהו משתנה.",
    fault: "{name} לא מקוון. שאר החיישנים ממשיכים. אל תתייחסו לתמונה כשלמה.",
    crisis: "פרוטוקול משבר פתוח. אוכל לעבור איתכם על הצעדים. ההחלטה שלכם.",
    recommended: "מומלץ",
    youDecide: "ייעוץ בלבד — ההחלטה שלכם.",
    closeCard: "סגירה",
    expand: "הרחבה",
    collapse: "כיווץ",
    notify: "להודיע לאדם הממונה",
    posted: "פורסם ברשת המשמרת.",
    alarmSent: "אזעקה נשלחה לממונה. ודאו שקיבל.",
    standBy: "Pilot בעמדה",
    picture: "תמונה",
    contacts: "מגעים",
    noContacts: "אין מגעים בעדיפות בתמונה הזו.",
    channelWatch: "משמרת",
    channelSupport: "Support",
    channelAlarm: "אזעקה",
    typeComms: "הודעה למשמרת…",
    sendComms: "שליחה",
    unread: "ל־Pilot יש פתק בשבילכם",
    seePicture: "קורא את {panel}.",
    step: "השלב הבא",
    protocol: "פרוטוקול",
    dismissAll: "לנקות פתקים",
    raiseInstruments: "מכשירים",
    raiseAdvice: "ייעוץ",
    raiseComms: "קשר",
    connected: "ברשת",
    offline: "אין נתיב",
    liveComms: "LIVE: satcom לא מחובר כאן. עדיין אין לי רשת משמרת חיה.",
    demoComms: "רשת DEMO — האנשים בתמונה הזו, לא רדיו חי.",
    watching: "במעקב",
    quiet: "שקט",
    degraded: "מוחלש",
    dark: "חשוך",
    panels: {
      radar: "מכ״ם",
      sonar: "סונאר",
      spectrum: "RF / ספקטרום",
      perimeter: "היקף",
    },
  },
} as const satisfies Record<Locale, PilotDeskCopy>;

export function pilotDeskCopy(locale: Locale): PilotDeskCopy {
  switch (locale) {
    case "es":
      return DESK.es;
    case "fr":
      return DESK.fr;
    case "de":
      return DESK.de;
    case "ru":
      return DESK.ru;
    case "uk":
      return DESK.uk;
    case "ar":
      return DESK.ar;
    case "zh":
      return DESK.zh;
    case "ja":
      return DESK.ja;
    case "he":
      return DESK.he;
    case "en":
    default:
      return DESK.en;
  }
}

export function fillDesk(template: string, vars: Record<string, string>) {
  return Object.entries(vars).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template,
  );
}
