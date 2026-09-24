import type { Locale } from "@/lib/i18n/locales";

export type PilotDemoCopy = {
  demo: string;
  play: string;
  stop: string;
  back: string;
  reset: string;
  next: string;
  calls: string;
  callStatus: string;
  callAdvice: string;
  callNotify: string;
  intro: string;
  officerStatus: string;
  quietStatus: string;
  officerAdvice: string;
  quietAdvice: string;
  officerNotify: string;
  notifyReply: string;
  outro: string;
  liveBlock: string;
  voiceReady: string;
  voiceNeural: string;
  voicePair: string;
  voiceEdge: string;
  voiceEleven: string;
  voiceFallback: string;
  voiceNone: string;
  sttReady: string;
  sttEngine: string;
  needMic: string;
  now: string;
  where: string;
  step: string;
  interruptHint: string;
  soundOn: string;
  soundOff: string;
  signalsOn: string;
  signalsOff: string;
  linkLive: string;
  bargeHint: string;
  talkListening: string;
  peakHold: string;
  actionIntro: string;
  whereIntro: string;
  actionInstruments: string;
  whereInstruments: string;
  actionAdvice: string;
  whereAdvice: string;
  actionComms: string;
  whereComms: string;
  actionOutro: string;
  whereOutro: string;
  actionOfficer: string;
  whereOfficer: string;
  actionLive: string;
  whoPilot: string;
  whoOfficer: string;
  studio: string;
  hearPilot: string;
  hearOfficer: string;
  previewPilot: string;
  previewOfficer: string;
};

const DEMO = {
  en: {
    demo: "Demo",
    play: "Play Pilot demo",
    stop: "Stop demo",
    back: "Back",
    reset: "Reset",
    next: "Next",
    calls: "Watch calls",
    callStatus: "Pilot, instruments",
    callAdvice: "Pilot, what do you recommend",
    callNotify: "Pilot, notify the designated",
    intro:
      "Pilot on watch. Radar, AIS, cameras, perimeter, sonar, satcom — all on me. I advise. You decide.",
    officerStatus: "Pilot, instruments.",
    quietStatus:
      "Instruments are quiet. Radar and AIS on the plot, cameras and perimeter standing by. I am here if the picture changes.",
    officerAdvice: "Pilot, what do you recommend.",
    quietAdvice:
      "Hold standard watch. Keep unidentified traffic on the plot. Advice only — you decide.",
    officerNotify: "Pilot, notify the designated.",
    notifyReply:
      "Posted to the watch net and the alarm channel. Confirm the designated person has it.",
    outro:
      "That is the drill. Press the mic and speak in this language, or tap a watch call.",
    liveBlock:
      "LIVE has no sensors on this install. Switch to DEMO for a spoken drill, or ask about StarWall.",
    voiceReady: "Spoken {lang} is ready on this browser.",
    voiceNeural: "Male neural voice for {lang} is connected ({voice}).",
    voicePair:
      "Two neural voices for {lang}: Pilot {voice}, officer {officer}.",
    voiceEdge:
      "ElevenLabs is not connected — {lang} is Edge ({voice} / {officer}). Add ELEVENLABS_API_KEY.",
    voiceEleven:
      "ElevenLabs voices for {lang}: Pilot {voice}, officer {officer}.",
    voiceFallback:
      "No native {lang} voice pack here — I speak with the closest installed voice until you add one in the OS or browser.",
    voiceNone: "This browser has no speech synthesis. I can still type.",
    sttReady: "I can listen in {lang} after you allow the microphone.",
    sttEngine: "Speech recognition needs Chrome or Edge on this machine.",
    needMic: "Allow the microphone to speak to Pilot in this language.",
    now: "Now",
    where: "Where",
    step: "{n} / {total}",
    interruptHint: "Stop, or ask — I halt and answer.",
    soundOn: "Sound on",
    soundOff: "Sound off",
    signalsOn: "Signals on",
    signalsOff: "Signals off",
    linkLive: "Secure link established",
    bargeHint: "Speak — I stop and take your words first.",
    talkListening: "Listening",
    peakHold: "Peak",
    actionIntro: "Pilot takes the watch",
    whereIntro: "Voice and instrument cards",
    actionInstruments: "Reading instruments",
    whereInstruments: "Instrument cards",
    actionAdvice: "Advice on the picture",
    whereAdvice: "Advice window",
    actionComms: "Watch net and alarm",
    whereComms: "Comms strip",
    actionOutro: "End of drill",
    whereOutro: "Mic and watch calls",
    actionOfficer: "Watch call",
    whereOfficer: "Dialogue",
    actionLive: "LIVE has no sensors",
    whoPilot: "Pilot",
    whoOfficer: "Officer",
    studio: "Voices",
    hearPilot: "Hear Pilot",
    hearOfficer: "Hear officer",
    previewPilot: "Pilot on watch. I read the picture. I advise. You decide.",
    previewOfficer: "Pilot, instruments.",
  },
  es: {
    demo: "Demo",
    play: "Reproducir demo de Pilot",
    stop: "Detener demo",
    back: "Atrás",
    reset: "Reiniciar",
    next: "Siguiente",
    calls: "Llamadas de guardia",
    callStatus: "Pilot, instrumentos",
    callAdvice: "Pilot, ¿qué recomienda?",
    callNotify: "Pilot, avise al designado",
    intro:
      "Pilot de guardia. Leo radar, AIS, cámaras, perímetro, sónar y satcom. Aconsejo. Usted decide.",
    officerStatus: "Pilot, instrumentos.",
    quietStatus:
      "Instrumentos en calma. Radar y AIS en el plot, cámaras y perímetro a la espera. Estoy si la imagen cambia.",
    officerAdvice: "Pilot, ¿qué recomienda?",
    quietAdvice:
      "Mantenga la guardia normal. Conserve el tráfico no identificado en el plot. Solo consejo — usted decide.",
    officerNotify: "Pilot, avise al designado.",
    notifyReply:
      "Publicado en la red de guardia y en el canal de alarma. Confirme que el designado lo tiene.",
    outro:
      "Eso es el ejercicio. Pulse el micrófono y hable en este idioma, o toque una llamada de guardia.",
    liveBlock:
      "LIVE no tiene sensores en esta instalación. Pase a DEMO para un ejercicio hablado, o pregunte por StarWall.",
    voiceReady: "La voz en {lang} está lista en este navegador.",
    voiceNeural: "Voz neural masculina de {lang} conectada ({voice}).",
    voicePair:
      "Dos voces neurales en {lang}: Pilot {voice}, oficial {officer}.",
    voiceEdge:
      "ElevenLabs no está conectado — {lang} usa Edge ({voice} / {officer}). Añada ELEVENLABS_API_KEY.",
    voiceEleven:
      "Voces ElevenLabs en {lang}: Pilot {voice}, oficial {officer}.",
    voiceFallback:
      "No hay paquete de voz nativo en {lang} — hablo con la voz instalada más cercana hasta que añada una en el sistema o el navegador.",
    voiceNone: "Este navegador no sintetiza voz. Puedo seguir escribiendo.",
    sttReady: "Puedo escuchar en {lang} cuando permita el micrófono.",
    sttEngine: "El reconocimiento de voz necesita Chrome o Edge en esta máquina.",
    needMic: "Permita el micrófono para hablar con Pilot en este idioma.",
    now: "Ahora",
    where: "Dónde",
    step: "{n} / {total}",
    interruptHint: "Pare o pregunte — me detengo y respondo.",
    soundOn: "Sonido activado",
    soundOff: "Sonido desactivado",
    signalsOn: "Señales activadas",
    signalsOff: "Señales desactivadas",
    linkLive: "Enlace seguro establecido",
    bargeHint: "Hable — me detengo y tomo sus palabras primero.",
    talkListening: "Escuchando",
    peakHold: "Pico",
    actionIntro: "Pilot toma la guardia",
    whereIntro: "Voz y tarjetas de instrumentos",
    actionInstruments: "Lectura de instrumentos",
    whereInstruments: "Tarjetas de instrumentos",
    actionAdvice: "Consejo sobre la imagen",
    whereAdvice: "Ventana de consejo",
    actionComms: "Red de guardia y alarma",
    whereComms: "Franja de comunicaciones",
    actionOutro: "Fin del ejercicio",
    whereOutro: "Micro y llamadas",
    actionOfficer: "Llamada de guardia",
    whereOfficer: "Diálogo",
    actionLive: "LIVE no tiene sensores",
    whoPilot: "Pilot",
    whoOfficer: "Oficial",
    studio: "Voces",
    hearPilot: "Oír a Pilot",
    hearOfficer: "Oír al oficial",
    previewPilot: "Pilot de guardia. Leo la imagen. Aconsejo. Usted decide.",
    previewOfficer: "Pilot, instrumentos.",
  },
  fr: {
    demo: "Démo",
    play: "Lancer la démo Pilot",
    stop: "Arrêter la démo",
    back: "Retour",
    reset: "Réinitialiser",
    next: "Suivant",
    calls: "Appels de quart",
    callStatus: "Pilot, instruments",
    callAdvice: "Pilot, que recommandez-vous",
    callNotify: "Pilot, prévenez la personne désignée",
    intro:
      "Pilot de quart. Je lis radar, AIS, caméras, périmètre, sonar et satcom. Je conseille. Vous décidez.",
    officerStatus: "Pilot, instruments.",
    quietStatus:
      "Instruments calmes. Radar et AIS sur le plot, caméras et périmètre en attente. Je suis là si l’image change.",
    officerAdvice: "Pilot, que recommandez-vous.",
    quietAdvice:
      "Tenez le quart normal. Gardez le trafic non identifié sur le plot. Conseil seulement — vous décidez.",
    officerNotify: "Pilot, prévenez la personne désignée.",
    notifyReply:
      "Publié sur le réseau de quart et le canal d’alarme. Confirmez que la personne désignée l’a.",
    outro:
      "Voilà l’exercice. Appuyez sur le micro et parlez dans cette langue, ou touchez un appel de quart.",
    liveBlock:
      "LIVE n’a aucun capteur sur cette installation. Passez en DEMO pour un exercice parlé, ou interrogez StarWall.",
    voiceReady: "La voix {lang} est prête sur ce navigateur.",
    voiceNeural: "Voix neurale masculine {lang} connectée ({voice}).",
    voicePair:
      "Deux voix neurales {lang} : Pilot {voice}, officier {officer}.",
    voiceEdge:
      "ElevenLabs n’est pas connecté — {lang} passe par Edge ({voice} / {officer}). Ajoutez ELEVENLABS_API_KEY.",
    voiceEleven:
      "Voix ElevenLabs {lang} : Pilot {voice}, officier {officer}.",
    voiceFallback:
      "Pas de voix native {lang} ici — je parle avec la voix installée la plus proche jusqu’à ce que vous en ajoutiez une dans le système ou le navigateur.",
    voiceNone: "Ce navigateur n’a pas de synthèse vocale. Je peux encore écrire.",
    sttReady: "Je peux écouter en {lang} après autorisation du micro.",
    sttEngine: "La reconnaissance vocale demande Chrome ou Edge sur cette machine.",
    needMic: "Autorisez le micro pour parler à Pilot dans cette langue.",
    now: "Maintenant",
    where: "Où",
    step: "{n} / {total}",
    interruptHint: "Stop ou une question — je m’arrête et je réponds.",
    soundOn: "Son allumé",
    soundOff: "Son coupé",
    signalsOn: "Signaux allumés",
    signalsOff: "Signaux coupés",
    linkLive: "Liaison sécurisée établie",
    bargeHint: "Parlez — je m’arrête et je prends vos mots d’abord.",
    talkListening: "Écoute",
    peakHold: "Crête",
    actionIntro: "Pilot prend le quart",
    whereIntro: "Voix et cartes d’instruments",
    actionInstruments: "Lecture des instruments",
    whereInstruments: "Cartes d’instruments",
    actionAdvice: "Conseil sur l’image",
    whereAdvice: "Fenêtre de conseil",
    actionComms: "Réseau de quart et alarme",
    whereComms: "Bande comms",
    actionOutro: "Fin de l’exercice",
    whereOutro: "Micro et appels",
    actionOfficer: "Appel de quart",
    whereOfficer: "Dialogue",
    actionLive: "LIVE n’a aucun capteur",
    whoPilot: "Pilot",
    whoOfficer: "Officier",
    studio: "Voix",
    hearPilot: "Écouter Pilot",
    hearOfficer: "Écouter l’officier",
    previewPilot: "Pilot de quart. Je lis l’image. Je conseille. Vous décidez.",
    previewOfficer: "Pilot, instruments.",
  },
  de: {
    demo: "Demo",
    play: "Pilot-Demo abspielen",
    stop: "Demo stoppen",
    back: "Zurück",
    reset: "Zurücksetzen",
    next: "Weiter",
    calls: "Wachrufe",
    callStatus: "Pilot, Instrumente",
    callAdvice: "Pilot, was empfehlen Sie",
    callNotify: "Pilot, benachrichtigen Sie die bestimmte Person",
    intro:
      "Pilot auf Wache. Ich lese Radar, AIS, Kameras, Perimeter, Sonar und Satcom. Ich rate. Sie entscheiden.",
    officerStatus: "Pilot, Instrumente.",
    quietStatus:
      "Instrumente ruhig. Radar und AIS auf dem Plot, Kameras und Perimeter in Bereitschaft. Ich bin da, wenn sich das Bild ändert.",
    officerAdvice: "Pilot, was empfehlen Sie.",
    quietAdvice:
      "Normale Wache halten. Unbekannten Verkehr auf dem Plot behalten. Nur Rat — Sie entscheiden.",
    officerNotify: "Pilot, benachrichtigen Sie die bestimmte Person.",
    notifyReply:
      "Im Wachnetz und im Alarmkanal hinterlegt. Bestätigen Sie, dass die bestimmte Person es hat.",
    outro:
      "Das ist die Übung. Mikrofon drücken und in dieser Sprache sprechen, oder einen Wachruf antippen.",
    liveBlock:
      "LIVE hat keine Sensoren auf dieser Installation. Wechseln Sie zu DEMO für eine gesprochene Übung, oder fragen Sie zu StarWall.",
    voiceReady: "Gesprochenes {lang} ist in diesem Browser bereit.",
    voiceNeural: "Männliche neurale Stimme für {lang} ist verbunden ({voice}).",
    voicePair:
      "Zwei neurale Stimmen für {lang}: Pilot {voice}, Wachoffizier {officer}.",
    voiceEdge:
      "ElevenLabs ist nicht verbunden — {lang} läuft über Edge ({voice} / {officer}). ELEVENLABS_API_KEY setzen.",
    voiceEleven:
      "ElevenLabs-Stimmen für {lang}: Pilot {voice}, Wachoffizier {officer}.",
    voiceFallback:
      "Kein natives {lang}-Sprachpaket — ich spreche mit der nächsten installierten Stimme, bis Sie eine im System oder Browser hinzufügen.",
    voiceNone: "Dieser Browser hat keine Sprachsynthese. Ich kann weiter tippen.",
    sttReady: "Ich höre {lang}, sobald Sie das Mikrofon erlauben.",
    sttEngine: "Spracherkennung braucht Chrome oder Edge auf diesem Rechner.",
    needMic: "Mikrofon erlauben, um mit Pilot in dieser Sprache zu sprechen.",
    now: "Jetzt",
    where: "Wo",
    step: "{n} / {total}",
    interruptHint: "Stopp oder fragen — ich halte an und antworte.",
    soundOn: "Ton an",
    soundOff: "Ton aus",
    signalsOn: "Signale an",
    signalsOff: "Signale aus",
    linkLive: "Sichere Verbindung hergestellt",
    bargeHint: "Sprechen Sie — ich halte an und nehme zuerst Ihre Worte.",
    talkListening: "Hören",
    peakHold: "Spitze",
    actionIntro: "Pilot übernimmt die Wache",
    whereIntro: "Stimme und Instrumentenkarten",
    actionInstruments: "Instrumente lesen",
    whereInstruments: "Instrumentenkarten",
    actionAdvice: "Rat zum Lagebild",
    whereAdvice: "Ratfenster",
    actionComms: "Wachnetz und Alarm",
    whereComms: "Comms-Leiste",
    actionOutro: "Ende der Übung",
    whereOutro: "Mikrofon und Wachrufe",
    actionOfficer: "Wachruf",
    whereOfficer: "Dialog",
    actionLive: "LIVE hat keine Sensoren",
    whoPilot: "Pilot",
    whoOfficer: "Wachoffizier",
    studio: "Stimmen",
    hearPilot: "Pilot hören",
    hearOfficer: "Offizier hören",
    previewPilot: "Pilot auf Wache. Ich lese das Bild. Ich rate. Sie entscheiden.",
    previewOfficer: "Pilot, Instrumente.",
  },
  ru: {
    demo: "Демо",
    play: "Показать демо Pilot",
    stop: "Остановить демо",
    back: "Назад",
    reset: "Сброс",
    next: "Далее",
    calls: "Реплики вахты",
    callStatus: "Pilot, приборы",
    callAdvice: "Pilot, что рекомендуете",
    callNotify: "Pilot, известить назначенного",
    intro:
      "Pilot на вахте. Радар, AIS, камеры, периметр, сонар, satcom — всё на мне. Советую. Решение за вами.",
    officerStatus: "Pilot, приборы.",
    quietStatus:
      "Приборы спокойны. Радар и AIS на картине, камеры и периметр наготове. Я здесь, если картина изменится.",
    officerAdvice: "Pilot, что рекомендуете.",
    quietAdvice:
      "Держите обычную вахту. Неопознанный трафик оставьте на картине. Это совет — решение за вами.",
    officerNotify: "Pilot, известить назначенного.",
    notifyReply:
      "Отметил в сети вахты и в канале тревоги. Убедитесь, что назначенный это видит.",
    outro:
      "Это учение. Нажмите микрофон и говорите на этом языке или выберите реплику вахты.",
    liveBlock:
      "В LIVE на этой установке нет датчиков. Переключитесь в DEMO для голосового учения или спросите про StarWall.",
    voiceReady: "Голос {lang} на этом браузере готов.",
    voiceNeural: "Подключён мужской нейроголос для {lang} ({voice}).",
    voicePair:
      "Два нейроголоса для {lang}: Pilot {voice}, офицер {officer}.",
    voiceEdge:
      "ElevenLabs не подключён — для {lang} сейчас Edge ({voice} / {officer}). Нужен ELEVENLABS_API_KEY.",
    voiceEleven:
      "ElevenLabs для {lang}: Pilot {voice}, офицер {officer}.",
    voiceFallback:
      "Нет родного голосового пакета {lang} — говорю ближайшим установленным голосом, пока не добавите пакет в систему или браузер.",
    voiceNone: "Этот браузер не умеет озвучку. Могу писать текстом.",
    sttReady: "Слышу {lang}, когда разрешите микрофон.",
    sttEngine: "Распознавание речи здесь нужно в Chrome или Edge.",
    needMic: "Разрешите микрофон, чтобы говорить с Pilot на этом языке.",
    now: "Сейчас",
    where: "Где",
    step: "{n} / {total}",
    interruptHint: "Стоп или вопрос — останавливаюсь и отвечаю.",
    soundOn: "Звук включён",
    soundOff: "Звук выключен",
    signalsOn: "Сигналы включены",
    signalsOff: "Сигналы выключены",
    linkLive: "Защищённый канал установлен",
    bargeHint: "Говорите — я останавливаюсь и сначала слушаю вас.",
    talkListening: "Слушаю",
    peakHold: "Пик",
    actionIntro: "Pilot заступает на вахту",
    whereIntro: "Голос и карточки приборов",
    actionInstruments: "Снимаю приборы",
    whereInstruments: "Карточки приборов",
    actionAdvice: "Совет по картине",
    whereAdvice: "Окно совета",
    actionComms: "Сеть вахты и тревога",
    whereComms: "Полоса связи",
    actionOutro: "Конец учения",
    whereOutro: "Микрофон и реплики",
    actionOfficer: "Реплика вахты",
    whereOfficer: "Диалог",
    actionLive: "В LIVE нет датчиков",
    whoPilot: "Pilot",
    whoOfficer: "Офицер",
    studio: "Голоса",
    hearPilot: "Слушать Pilot",
    hearOfficer: "Слушать офицера",
    previewPilot: "Pilot на вахте. Читаю картину. Советую. Решаете вы.",
    previewOfficer: "Pilot, приборы.",
  },
  uk: {
    demo: "Демо",
    play: "Показати демо Pilot",
    stop: "Зупинити демо",
    back: "Назад",
    reset: "Скидання",
    next: "Далі",
    calls: "Репліки вахти",
    callStatus: "Pilot, прилади",
    callAdvice: "Pilot, що рекомендуєте",
    callNotify: "Pilot, сповістити призначеного",
    intro:
      "Pilot на вахті. Читаю радар, AIS, камери, периметр, сонар і satcom. Раджу. Рішення за вами.",
    officerStatus: "Pilot, прилади.",
    quietStatus:
      "Прилади спокійні. Радар і AIS на картині, камери й периметр напоготові. Я тут, якщо картина зміниться.",
    officerAdvice: "Pilot, що рекомендуєте.",
    quietAdvice:
      "Тримайте звичайну вахту. Нерозпізнаний трафік залиште на картині. Це порада — рішення за вами.",
    officerNotify: "Pilot, сповістити призначеного.",
    notifyReply:
      "Позначив у мережі вахти й у каналі тривоги. Переконайтеся, що призначений це бачить.",
    outro:
      "Це навчання. Натисніть мікрофон і говоріть цією мовою або оберіть репліку вахти.",
    liveBlock:
      "У LIVE на цій установці немає датчиків. Перемкніться в DEMO для голосового навчання або запитайте про StarWall.",
    voiceReady: "Голос {lang} у цьому браузері готовий.",
    voiceNeural: "Підключено чоловічий нейроголос для {lang} ({voice}).",
    voicePair:
      "Два нейроголоси для {lang}: Pilot {voice}, офіцер {officer}.",
    voiceEdge:
      "ElevenLabs не підключено — для {lang} зараз Edge ({voice} / {officer}). Потрібен ELEVENLABS_API_KEY.",
    voiceEleven:
      "ElevenLabs для {lang}: Pilot {voice}, офіцер {officer}.",
    voiceFallback:
      "Немає рідного голосового пакета {lang} — кажу найближчим встановленим голосом, доки не додасте пакет у систему чи браузер.",
    voiceNone: "Цей браузер не озвучує. Можу писати текстом.",
    sttReady: "Чую {lang}, коли дозволите мікрофон.",
    sttEngine: "Розпізнавання мовлення тут потрібне в Chrome або Edge.",
    needMic: "Дозвольте мікрофон, щоб говорити з Pilot цією мовою.",
    now: "Зараз",
    where: "Де",
    step: "{n} / {total}",
    interruptHint: "Стоп або питання — зупиняюсь і відповідаю.",
    soundOn: "Звук увімкнено",
    soundOff: "Звук вимкнено",
    signalsOn: "Сигнали увімкнено",
    signalsOff: "Сигнали вимкнено",
    linkLive: "Захищений канал встановлено",
    bargeHint: "Говоріть — я зупиняюсь і спочатку слухаю вас.",
    talkListening: "Слухаю",
    peakHold: "Пік",
    actionIntro: "Pilot заступає на вахту",
    whereIntro: "Голос і картки приладів",
    actionInstruments: "Знімаю прилади",
    whereInstruments: "Картки приладів",
    actionAdvice: "Порада щодо картини",
    whereAdvice: "Вікно поради",
    actionComms: "Мережа вахти й тривога",
    whereComms: "Смуга зв’язку",
    actionOutro: "Кінець навчання",
    whereOutro: "Мікрофон і репліки",
    actionOfficer: "Репліка вахти",
    whereOfficer: "Діалог",
    actionLive: "У LIVE немає датчиків",
    whoPilot: "Pilot",
    whoOfficer: "Офіцер",
    studio: "Голоси",
    hearPilot: "Слухати Pilot",
    hearOfficer: "Слухати офіцера",
    previewPilot: "Pilot на вахті. Читаю картину. Раджу. Вирішуєте ви.",
    previewOfficer: "Pilot, прилади.",
  },
  ar: {
    demo: "تجربة",
    play: "تشغيل تجربة Pilot",
    stop: "إيقاف التجربة",
    back: "رجوع",
    reset: "إعادة",
    next: "التالي",
    calls: "نداءات الخفارة",
    callStatus: "Pilot، الأجهزة",
    callAdvice: "Pilot، ماذا توصي",
    callNotify: "Pilot، أبلغ المعيّن",
    intro:
      "Pilot على الخفارة. أقرأ الرادار وAIS والكاميرات والمحيط والسونار وsatcom. أنصح. القرار لكم.",
    officerStatus: "Pilot، الأجهزة.",
    quietStatus:
      "الأجهزة هادئة. الرادار وAIS على الرسم، الكاميرات والمحيط في الانتظار. أنا هنا إن تغيّرت الصورة.",
    officerAdvice: "Pilot، ماذا توصي.",
    quietAdvice:
      "أبقوا الخفارة العادية. أبقوا الحركة غير المعرّفة على الرسم. نصيحة فقط — القرار لكم.",
    officerNotify: "Pilot، أبلغ المعيّن.",
    notifyReply:
      "نُشر على شبكة الخفارة وقناة الإنذار. أكّدوا أن المعيّن رآه.",
    outro:
      "هذا التمرين. اضغطوا الميكروفون وتكلموا بهذه اللغة، أو اختاروا نداء خفارة.",
    liveBlock:
      "LIVE بلا مستشعرات في هذا النشر. انتقلوا إلى DEMO لتمرين منطوق، أو اسألوا عن StarWall.",
    voiceReady: "صوت {lang} جاهز في هذا المتصفح.",
    voiceNeural: "صوت عصبي ذكوري لـ {lang} متصل ({voice}).",
    voicePair:
      "صوتان عصبيان لـ {lang}: Pilot {voice} والضابط {officer}.",
    voiceEdge:
      "ElevenLabs غير متصل — {lang} على Edge ({voice} / {officer}). أضف ELEVENLABS_API_KEY.",
    voiceEleven:
      "أصوات ElevenLabs لـ {lang}: Pilot {voice} والضابط {officer}.",
    voiceFallback:
      "لا حزمة صوت أصلية لـ {lang} — أتكلم بأقرب صوت مثبّت حتى تضيفوا واحدة في النظام أو المتصفح.",
    voiceNone: "هذا المتصفح بلا تركيب كلام. أستطيع الكتابة.",
    sttReady: "أسمع {lang} بعد السماح بالميكروفون.",
    sttEngine: "التعرّف على الكلام يحتاج Chrome أو Edge على هذا الجهاز.",
    needMic: "اسمحوا بالميكروفون للتحدث إلى Pilot بهذه اللغة.",
    now: "الآن",
    where: "أين",
    step: "{n} / {total}",
    interruptHint: "توقف أو اسأل — أصمت وأجيب.",
    soundOn: "الصوت يعمل",
    soundOff: "الصوت مغلق",
    signalsOn: "الإشارات تعمل",
    signalsOff: "الإشارات مغلقة",
    linkLive: "تم إنشاء وصلة آمنة",
    bargeHint: "تكلم — أتوقف وأسمعك أولاً.",
    talkListening: "أستمع",
    peakHold: "ذروة",
    actionIntro: "Pilot يتولى الخفارة",
    whereIntro: "الصوت وبطاقات الأجهزة",
    actionInstruments: "قراءة الأجهزة",
    whereInstruments: "بطاقات الأجهزة",
    actionAdvice: "نصيحة عن الصورة",
    whereAdvice: "نافذة النصيحة",
    actionComms: "شبكة الخفارة والإنذار",
    whereComms: "شريط الاتصال",
    actionOutro: "نهاية التمرين",
    whereOutro: "الميكروفون والنداءات",
    actionOfficer: "نداء خفارة",
    whereOfficer: "الحوار",
    actionLive: "LIVE بلا مستشعرات",
    whoPilot: "Pilot",
    whoOfficer: "الضابط",
    studio: "الأصوات",
    hearPilot: "اسمع Pilot",
    hearOfficer: "اسمع الضابط",
    previewPilot: "Pilot في الخفارة. أقرأ الصورة. أنصح. القرار لكم.",
    previewOfficer: "Pilot، الأجهزة.",
  },
  zh: {
    demo: "演示",
    play: "播放 Pilot 演示",
    stop: "停止演示",
    back: "返回",
    reset: "重置",
    next: "下一步",
    calls: "值班口令",
    callStatus: "Pilot，仪器",
    callAdvice: "Pilot，你建议什么",
    callNotify: "Pilot，通知指定人员",
    intro:
      "Pilot 在值班。我读雷达、AIS、摄像头、周界、声呐和卫星链路。我给建议。由您决定。",
    officerStatus: "Pilot，仪器。",
    quietStatus:
      "仪器安静。雷达和 AIS 在图上，摄像头和周界待命。画面一变我就在。",
    officerAdvice: "Pilot，你建议什么。",
    quietAdvice: "保持常规值班。把不明交通留在图上。仅供建议 — 由您决定。",
    officerNotify: "Pilot，通知指定人员。",
    notifyReply: "已发到值班网和警报频道。请确认指定人员已经看到。",
    outro: "演练结束。按麦克风用当前语言说话，或点一条值班口令。",
    liveBlock: "此安装的 LIVE 没有传感器。切换到 DEMO 做语音演练，或询问 StarWall。",
    voiceReady: "此浏览器已准备好 {lang} 语音。",
    voiceNeural: "已接通 {lang} 男声神经语音（{voice}）。",
    voicePair: "{lang} 两个神经语音：Pilot {voice}，值班 {officer}。",
    voiceEdge:
      "未连接 ElevenLabs — {lang} 现用 Edge（{voice} / {officer}）。请设置 ELEVENLABS_API_KEY。",
    voiceEleven: "ElevenLabs {lang}：Pilot {voice}，值班 {officer}。",
    voiceFallback:
      "这里没有 {lang} 原生语音包 — 我用最接近的已装语音，直到您在系统或浏览器中添加。",
    voiceNone: "此浏览器不能朗读。我仍可打字。",
    sttReady: "允许麦克风后我能听 {lang}。",
    sttEngine: "语音识别需要本机上的 Chrome 或 Edge。",
    needMic: "请允许麦克风，以便用当前语言对 Pilot 说话。",
    now: "现在",
    where: "位置",
    step: "{n} / {total}",
    interruptHint: "说停止或提问 — 我停下并回答。",
    soundOn: "声音开",
    soundOff: "声音关",
    signalsOn: "信号开",
    signalsOff: "信号关",
    linkLive: "安全链路已建立",
    bargeHint: "请说 — 我会停下并先听你的话。",
    talkListening: "正在听",
    peakHold: "峰值",
    actionIntro: "Pilot 接班",
    whereIntro: "语音和仪器卡片",
    actionInstruments: "读取仪器",
    whereInstruments: "仪器卡片",
    actionAdvice: "针对画面的建议",
    whereAdvice: "建议窗口",
    actionComms: "值班网与警报",
    whereComms: "通信条",
    actionOutro: "演练结束",
    whereOutro: "麦克风和口令",
    actionOfficer: "值班口令",
    whereOfficer: "对话",
    actionLive: "LIVE 没有传感器",
    whoPilot: "Pilot",
    whoOfficer: "值班",
    studio: "语音",
    hearPilot: "听 Pilot",
    hearOfficer: "听值班官",
    previewPilot: "Pilot 在值班。我读画面。我建议。由您决定。",
    previewOfficer: "Pilot，仪器。",
  },
  ja: {
    demo: "デモ",
    play: "Pilot デモを再生",
    stop: "デモを止める",
    back: "戻る",
    reset: "リセット",
    next: "次へ",
    calls: "当直の呼びかけ",
    callStatus: "Pilot、計器",
    callAdvice: "Pilot、推奨は",
    callNotify: "Pilot、指名者に知らせて",
    intro:
      "Pilot は当直中です。レーダー、AIS、カメラ、ペリメータ、ソナー、satcom を読みます。助言します。判断はあなたです。",
    officerStatus: "Pilot、計器。",
    quietStatus:
      "計器は静かです。レーダーと AIS はプロット上、カメラとペリメータは待機。画面が変われば私はいます。",
    officerAdvice: "Pilot、推奨は。",
    quietAdvice:
      "通常当直を維持。未識別の交通はプロットに残す。助言のみ — 判断はあなたです。",
    officerNotify: "Pilot、指名者に知らせて。",
    notifyReply:
      "当直ネットと警報チャネルに出しました。指名者が受け取ったか確認してください。",
    outro:
      "これが訓練です。マイクを押してこの言語で話すか、当直の呼びかけを選んでください。",
    liveBlock:
      "この導入の LIVE にセンサーはありません。音声訓練は DEMO へ切り替えるか、StarWall について尋ねてください。",
    voiceReady: "このブラウザで {lang} の音声は準備できています。",
    voiceNeural: "{lang} の男性ニューラル音声が接続されています（{voice}）。",
    voicePair:
      "{lang} のニューラル音声は2つ：Pilot {voice}、当直 {officer}。",
    voiceEdge:
      "ElevenLabs 未接続 — {lang} は Edge（{voice} / {officer}）。ELEVENLABS_API_KEY を設定。",
    voiceEleven:
      "ElevenLabs の {lang}：Pilot {voice}、当直 {officer}。",
    voiceFallback:
      "{lang} のネイティブ音声パックがありません — OS かブラウザに追加するまで、最も近いインストール済み音声で話します。",
    voiceNone: "このブラウザは音声合成がありません。文字は送れます。",
    sttReady: "マイクを許可すれば {lang} を聞けます。",
    sttEngine: "音声認識はこのマシンの Chrome または Edge が必要です。",
    needMic: "この言語で Pilot に話すにはマイクを許可してください。",
    now: "いま",
    where: "どこ",
    step: "{n} / {total}",
    interruptHint: "停止か質問 — 止まって答えます。",
    soundOn: "音声オン",
    soundOff: "音声オフ",
    signalsOn: "信号オン",
    signalsOff: "信号オフ",
    linkLive: "セキュアリンク確立",
    bargeHint: "話してください — 止まって先にあなたの言葉を受けます。",
    talkListening: "聴取中",
    peakHold: "ピーク",
    actionIntro: "Pilot が当直につく",
    whereIntro: "音声と計器カード",
    actionInstruments: "計器を読む",
    whereInstruments: "計器カード",
    actionAdvice: "画面への助言",
    whereAdvice: "助言ウィンドウ",
    actionComms: "当直ネットと警報",
    whereComms: "通信バー",
    actionOutro: "訓練の終わり",
    whereOutro: "マイクと呼びかけ",
    actionOfficer: "当直の呼びかけ",
    whereOfficer: "対話",
    actionLive: "LIVE にセンサーなし",
    whoPilot: "Pilot",
    whoOfficer: "当直",
    studio: "音声",
    hearPilot: "Pilot を聞く",
    hearOfficer: "当直を聞く",
    previewPilot: "Pilot、当直です。画面を読みます。助言します。判断はあなたです。",
    previewOfficer: "Pilot、計器。",
  },
  he: {
    demo: "הדגמה",
    play: "השמעת הדגמת Pilot",
    stop: "עצירת ההדגמה",
    back: "חזרה",
    reset: "איפוס",
    next: "הבא",
    calls: "קריאות משמרת",
    callStatus: "Pilot, מכשירים",
    callAdvice: "Pilot, מה אתה ממליץ",
    callNotify: "Pilot, הודע לממונה",
    intro:
      "Pilot במשמרת. אני קורא מכ״ם, AIS, מצלמות, היקף, סונאר ו־satcom. אני מייעץ. אתם מחליטים.",
    officerStatus: "Pilot, מכשירים.",
    quietStatus:
      "המכשירים שקטים. מכ״ם ו־AIS על הפלט, מצלמות והיקף בהמתנה. אני כאן אם התמונה משתנה.",
    officerAdvice: "Pilot, מה אתה ממליץ.",
    quietAdvice:
      "שמרו משמרת רגילה. השאירו תנועה לא מזוהה על הפלט. ייעוץ בלבד — אתם מחליטים.",
    officerNotify: "Pilot, הודע לממונה.",
    notifyReply:
      "פורסם לרשת המשמרת ולערוץ האזעקה. ודאו שהממונה קיבל.",
    outro:
      "זה התרגיל. לחצו על המיקרופון ודברו בשפה הזו, או בחרו קריאת משמרת.",
    liveBlock:
      "ב־LIVE אין חיישנים בפריסה הזו. עברו ל־DEMO לתרגול מדובר, או שאלו על StarWall.",
    voiceReady: "דיבור ב־{lang} מוכן בדפדפן הזה.",
    voiceNeural: "קול עצבי גברי ל־{lang} מחובר ({voice}).",
    voicePair:
      "שני קולות עצביים ל־{lang}: Pilot {voice}, קצין {officer}.",
    voiceEdge:
      "ElevenLabs לא מחובר — {lang} ב־Edge ({voice} / {officer}). נדרש ELEVENLABS_API_KEY.",
    voiceEleven:
      "ElevenLabs ל־{lang}: Pilot {voice}, קצין {officer}.",
    voiceFallback:
      "אין חבילת קול מקורית ל־{lang} — אדבר בקול המותקן הקרוב עד שתוסיפו אחת במערכת או בדפדפן.",
    voiceNone: "לדפדפן הזה אין הקראה. אפשר להקליד.",
    sttReady: "אני שומע {lang} אחרי אישור המיקרופון.",
    sttEngine: "זיהוי דיבור דורש Chrome או Edge במחשב הזה.",
    needMic: "אשרו את המיקרופון כדי לדבר עם Pilot בשפה הזו.",
    now: "עכשיו",
    where: "איפה",
    step: "{n} / {total}",
    interruptHint: "עצור או שאלו — אני נעצר ועונה.",
    soundOn: "קול פועל",
    soundOff: "קול כבוי",
    signalsOn: "אותות פועלים",
    signalsOff: "אותות כבויים",
    linkLive: "קישור מאובטח הוקם",
    bargeHint: "דברו — אני עוצר ושומע אתכם קודם.",
    talkListening: "מאזין",
    peakHold: "שיא",
    actionIntro: "Pilot נכנס למשמרת",
    whereIntro: "קול וכרטיסי מכשירים",
    actionInstruments: "קריאת מכשירים",
    whereInstruments: "כרטיסי מכשירים",
    actionAdvice: "ייעוץ על התמונה",
    whereAdvice: "חלון ייעוץ",
    actionComms: "רשת משמרת ואזעקה",
    whereComms: "פס קשר",
    actionOutro: "סוף התרגיל",
    whereOutro: "מיקרופון וקריאות",
    actionOfficer: "קריאת משמרת",
    whereOfficer: "דיאלוג",
    actionLive: "ב־LIVE אין חיישנים",
    whoPilot: "Pilot",
    whoOfficer: "קצין",
    studio: "קולות",
    hearPilot: "השמע Pilot",
    hearOfficer: "השמע קצין",
    previewPilot: "Pilot במשמרת. אני קורא את התמונה. אני מייעץ. אתם מחליטים.",
    previewOfficer: "Pilot, מכשירים.",
  },
} as const satisfies Record<Locale, PilotDemoCopy>;

export function pilotDemoCopy(locale: Locale): PilotDemoCopy {
  switch (locale) {
    case "es":
      return DEMO.es;
    case "fr":
      return DEMO.fr;
    case "de":
      return DEMO.de;
    case "ru":
      return DEMO.ru;
    case "uk":
      return DEMO.uk;
    case "ar":
      return DEMO.ar;
    case "zh":
      return DEMO.zh;
    case "ja":
      return DEMO.ja;
    case "he":
      return DEMO.he;
    case "en":
    default:
      return DEMO.en;
  }
}

export function fillDemo(template: string, vars: Record<string, string>) {
  return Object.entries(vars).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template,
  );
}
