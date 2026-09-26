import type { Locale } from "@/lib/i18n/locales";

export type PilotFactId =
  | "radarRange"
  | "cameras"
  | "sonar"
  | "spectrum"
  | "sensors"
  | "interceptors"
  | "countermeasures"
  | "decides"
  | "demoLive"
  | "pilotRole"
  | "names"
  | "starlink"
  | "plans"
  | "containers"
  | "how"
  | "risk"
  | "connections"
  | "ais"
  | "blackbox"
  | "replace"
  | "offline";

const en: Record<PilotFactId, string> = {
  radarRange:
    "The StarDome 3D AESA radar covers air and surface through 360°, out to 15 km. That is the container suite, not the range rings on the AGRON 1 drill picture. A Business container can add extended sensor range. The person who writes the contract names the figure for a specific hull.",
  cameras:
    "Multi-spectrum cameras on the StarDome container cover day, night, thermal, and SWIR out to 10 km. They feed the same picture as the radar. They do not invent a contact.",
  sonar:
    "Acoustic sonar on the container looks underwater out to about 1 km. It sits next to the air and surface radar on one picture. A person still decides what to do with a contact.",
  spectrum:
    "The spectral analyzer watches RF and signal intelligence across a wide band. Acoustic radar picks up low, slow, small targets and surface disturbances. Both feed StarWall. They do not fire anything.",
  sensors:
    "The detection suite is 3D AESA radar to 15 km, multi-spectrum cameras to 10 km, acoustic sonar to 1 km, plus acoustic radar and a spectral analyzer. All of that runs on StarWall and lands on AGRON 1. Nothing in the suite decides for the watch.",
  interceptors:
    "Interceptor UAVs on selected container tiers are remote-controlled, about 200+ km/h, out to 20 km, up to 25 minutes. They do not launch themselves. A licensed operator authorizes them, and local law still applies.",
  countermeasures:
    "Electronic warfare and the microwave bay are optional, licensed, and never self-trigger. StarWall can recommend. A person on watch authorizes. Ask /contact if you need the legal path for a jurisdiction.",
  decides:
    "The captain or the security officer decides. Pilot and AGRON 1 can show a next step. They do not take the watch.",
  demoLive:
    "DEMO is a drill with invented traffic so you can click. LIVE is this install as it stands — empty until sensors are wired. An empty LIVE is honest, not a fault.",
  pilotRole:
    "I am Pilot, the watch advisor. I answer from the product briefing and, on AGRON 1, from the current picture. I do not replace the officer. Advice only.",
  names:
    "StarWall is the platform. AGRON 1 is this watch program. StarDome Inc. builds it. StarDome Container is the steel box. Pilot is the advisor on the watch.",
  starlink:
    "Watch comms carry two Starlink services — Maritime and Priority — with lock, latency, SNR, and obstruction on the same board. LIVE stays offline until a real satcom path exists.",
  plans:
    "Public plans are LIGHT, ADVANCED, INTELLIGENCE, and CUSTOM. What they include is on /pricing. This site never quotes a dollar figure. The person who writes the contract names the number.",
  containers:
    "AGRON is the steel — roughly a 20-foot box, about 9,500 kg, 10–15 kW, −30 to +50 °C, 72+ hours of autonomy, ready in under two hours. StarDome is the system inside. Detection runs on StarWall.",
  how: "Adapters read the radar, cameras, AIS, and perimeter already on site. One picture, one clock. Risk is Normal, Attention, Elevated, or Critical. A recommended next step sits next to the word. The watch still owns the call.",
  risk: "Four words: Normal, Attention, Elevated, Critical. When the word changes, the reason sits next to it. It is a suggestion for the person on watch, not an order.",
  connections:
    "Sensors feed StarDome Core. The core pushes the same picture to AGRON 1 and to the Support Center. The connections map on /interface/connections shows that topology.",
  ais: "AIS is one feed among others. It lands on the same picture as radar and cameras. A contact with no AIS is still a contact. The officer decides whether to hail.",
  blackbox:
    "The Black Box writes on this device first. A cloud copy exists only after a signed-in write is confirmed. DEMO records stay local until you ask otherwise.",
  replace:
    "No. StarWall reads what is already paid for — radar, cameras, navigation — through adapters. A forklift upgrade of the helm is someone else's pitch.",
  offline:
    "If a link drops, StarWall keeps working locally and buffers until the path returns. Losing one satcom path does not shut the picture.",
};

const ru: Record<PilotFactId, string> = {
  radarRange:
    "3D AESA-радар StarDome смотрит воздух и поверхность на 360°, до 15 км. Это предел комплекта на контейнере, не кольца на учебной картине AGRON 1. На уровне Business дальность датчиков можно увеличить. Цифру для конкретного корпуса называет тот, кто пишет контракт.",
  cameras:
    "Мультиспектральные камеры контейнера — день, ночь, тепловизор и SWIR до 10 км. Они входят в ту же картину, что и радар. Контакт сами не выдумывают.",
  sonar:
    "Акустический сонар смотрит под воду примерно до 1 км. На AGRON 1 он стоит рядом с воздушно-надводным радаром. Что делать с контактом — решает вахта.",
  spectrum:
    "Спектральный анализатор ведёт радиоразведку в широкой полосе. Акустический радар ловит низкие, медленные, малые цели и возмущения поверхности. Оба кормят StarWall. Сами ничего не включают.",
  sensors:
    "Комплекс: 3D AESA до 15 км, камеры до 10 км, сонар до 1 км, плюс акустический радар и спектральный анализатор. Всё это крутится на StarWall и садится на AGRON 1. Решение остаётся за вахтой.",
  interceptors:
    "Перехватчики на отдельных уровнях — дистанционные БПЛА, около 200+ км/ч, до 20 км, до 25 минут. Сами не взлетают. Лицензированный оператор разрешает, местное право остаётся.",
  countermeasures:
    "РЭБ и микроволновый отсек — опция, по лицензии, сами не срабатывают. StarWall может посоветовать. Включает человек на вахте. Юридический путь — через /contact.",
  decides:
    "Решает капитан или офицер охраны. Pilot и AGRON 1 могут показать следующий шаг. Вахту они не забирают.",
  demoLive:
    "DEMO — учение с выдуманным трафиком, чтобы было что нажимать. LIVE — эта установка как есть: пусто, пока датчики не подключены. Пустой LIVE — честно, не баг.",
  pilotRole:
    "Я Pilot, советник вахты. Отвечаю из брифинга продукта и, на AGRON 1, из текущей картины. Офицера не заменяю. Только совет.",
  names:
    "StarWall — платформа. AGRON 1 — эта программа вахты. StarDome Inc. её строит. StarDome Container — стальной ящик. Pilot — советник на вахте.",
  starlink:
    "На связи два сервиса Starlink — Maritime и Priority: захват, задержка, SNR и затенение на одной доске. В LIVE канал молчит, пока нет настоящего satcom.",
  plans:
    "Открытые уровни: LIGHT, ADVANCED, INTELLIGENCE и CUSTOM. Что входит — на /pricing. Суммы на сайте нет. Цифру называет тот, кто ведёт контракт.",
  containers:
    "AGRON — сталь: примерно 20-футовый ящик, около 9 500 кг, 10–15 кВт, −30…+50 °C, автономность 72+ часа, готовность меньше двух часов. StarDome — система внутри. Обнаружение на StarWall.",
  how: "Адаптеры читают радар, камеры, AIS и периметр, что уже стоят. Одна картина, одни часы. Риск: Normal, Attention, Elevated, Critical. Рядом — следующий шаг. Вызов за вахтой.",
  risk: "Четыре слова: Normal, Attention, Elevated, Critical. Слово сменилось — причина рядом. Это совет вахте, не приказ.",
  connections:
    "Датчики идут в StarDome Core. Ядро гонит ту же картину на AGRON 1 и в Support Center. Схема — на /interface/connections.",
  ais: "AIS — одна из лент. Садится на ту же карту, что радар и камеры. Контакт без AIS всё равно контакт. Вызывать по радио или нет — решает офицер.",
  blackbox:
    "Чёрный ящик сначала пишет на этом устройстве. Облачная копия появляется только после подтверждённой записи под входом. Записи DEMO остаются локально, пока не попросите иначе.",
  replace:
    "Нет. StarWall читает то, что уже куплено — радар, камеры, навигацию — через адаптеры. Менять рубку целиком мы не предлагаем.",
  offline:
    "Если линк падает, StarWall работает локально и копит, пока путь не вернётся. Один оборванный satcom картину не гасит.",
};

const es: Record<PilotFactId, string> = {
  radarRange:
    "El radar AESA 3D de StarDome cubre aire y superficie 360° hasta 15 km. Eso es el conjunto del contenedor, no los anillos del cuadro de ejercicio en AGRON 1. Business puede ampliar el alcance. Quien redacta el contrato da la cifra de ese casco.",
  cameras:
    "Las cámaras multiespectro del contenedor cubren día, noche, térmico y SWIR hasta 10 km. Entran en el mismo cuadro que el radar. No inventan un contacto.",
  sonar:
    "El sónar acústico mira bajo el agua unos 1 km. En AGRON 1 está junto al radar. Qué hacer con el contacto lo decide la guardia.",
  spectrum:
    "El analizador espectral vigila RF e inteligencia de señales. El radar acústico coge blancos bajos, lentos y pequeños. Ambos alimentan StarWall. No disparan nada.",
  sensors:
    "Suite: radar AESA 3D a 15 km, cámaras a 10 km, sónar a 1 km, más radar acústico y analizador espectral. Todo corre en StarWall y llega a AGRON 1. La guardia decide.",
  interceptors:
    "Los interceptores en algunos niveles son UAV remotos, unos 200+ km/h, hasta 20 km, 25 min. No despegan solos. Un operador con licencia autoriza. Sigue la ley local.",
  countermeasures:
    "Guerra electrónica y microondas son opcionales, con licencia, y nunca se disparan solas. StarWall puede aconsejar. Autoriza quien está de guardia. La vía legal: /contact.",
  decides:
    "Decide el capitán o el oficial de seguridad. Pilot y AGRON 1 pueden mostrar el siguiente paso. No toman la guardia.",
  demoLive:
    "DEMO es un ejercicio con tráfico inventado. LIVE es esta instalación tal cual — vacía hasta cablear sensores. Un LIVE vacío es honesto.",
  pilotRole:
    "Soy Pilot, el asesor de guardia. Respondo con el briefing del producto y, en AGRON 1, con el cuadro actual. No sustituyo al oficial. Solo consejo.",
  names:
    "StarWall es la plataforma. AGRON 1 es este programa de guardia. StarDome Inc. lo construye. StarDome Container es la caja de acero. Pilot es el asesor.",
  starlink:
    "La guardia lleva dos Starlink — Maritime y Priority — con bloqueo, latencia, SNR y obstáculo en el mismo tablero. LIVE sigue fuera hasta un satcom real.",
  plans:
    "Planes públicos: LIGHT, ADVANCED, INTELLIGENCE y CUSTOM. Lo que incluyen está en /pricing. Este sitio no cita dólares. El número lo dice quien redacta el contrato.",
  containers:
    "AGRON es el acero: caja de unos 20 pies, unos 9 500 kg, 10–15 kW, −30 a +50 °C, 72+ h, lista en menos de dos horas. StarDome es el sistema dentro. La detección corre en StarWall.",
  how: "Adaptadores leen el radar, las cámaras, el AIS y el perímetro que ya están. Un cuadro, un reloj. Riesgo: Normal, Attention, Elevated, Critical. Al lado, el siguiente paso. La llamada es de la guardia.",
  risk: "Cuatro palabras: Normal, Attention, Elevated, Critical. Si cambia la palabra, la razón está al lado. Es consejo, no una orden.",
  connections:
    "Los sensores van al núcleo StarDome. El núcleo empuja el mismo cuadro a AGRON 1 y al Support Center. El mapa está en /interface/connections.",
  ais: "AIS es una fuente más. Cae en el mismo cuadro que radar y cámaras. Un contacto sin AIS sigue siendo un contacto. El oficial decide si llama.",
  blackbox:
    "La Black Box escribe primero en este aparato. La copia en la nube solo existe tras una escritura confirmada con sesión. DEMO se queda local hasta que pida otra cosa.",
  replace:
    "No. StarWall lee lo que ya está pagado — radar, cámaras, navegación — con adaptadores. No pedimos cambiar el puente.",
  offline:
    "Si cae un enlace, StarWall sigue en local y guarda hasta que vuelva. Un satcom caído no apaga el cuadro.",
};

const fr: Record<PilotFactId, string> = {
  radarRange:
    "Le radar AESA 3D StarDome couvre l’air et la surface sur 360°, jusqu’à 15 km. C’est le kit du conteneur, pas les anneaux du tableau d’exercice AGRON 1. Business peut allonger la portée. Le contrat donne le chiffre pour une coque.",
  cameras:
    "Les caméras multi-spectre du conteneur font jour, nuit, thermique et SWIR jusqu’à 10 km. Elles rejoignent le même tableau que le radar. Elles n’inventent pas un contact.",
  sonar:
    "Le sonar acoustique regarde sous l’eau vers 1 km. Sur AGRON 1 il est à côté du radar. La décision reste au quart.",
  spectrum:
    "L’analyseur spectral surveille la RF et le renseignement signal. Le radar acoustique prend les cibles basses, lentes, petites. Les deux nourrissent StarWall. Rien ne tire tout seul.",
  sensors:
    "Suite : radar AESA 3D à 15 km, caméras à 10 km, sonar à 1 km, plus radar acoustique et analyseur spectral. Tout tourne sur StarWall et arrive sur AGRON 1. Le quart décide.",
  interceptors:
    "Les intercepteurs sur certains niveaux sont des UAV à distance, environ 200+ km/h, 20 km, 25 min. Ils ne décollent pas seuls. Un opérateur licencié autorise. Le droit local reste.",
  countermeasures:
    "Guerre électronique et baie micro-ondes sont optionnelles, licenciées, et ne se déclenchent jamais seules. StarWall peut conseiller. Le quart autorise. Voie légale : /contact.",
  decides:
    "Le capitaine ou l’officier de sécurité décide. Pilot et AGRON 1 peuvent montrer l’étape suivante. Ils ne prennent pas le quart.",
  demoLive:
    "DEMO est un exercice avec du trafic inventé. LIVE est cette installation telle quelle — vide tant qu’aucun capteur n’est câblé. Un LIVE vide est honnête.",
  pilotRole:
    "Je suis Pilot, conseiller de quart. Je réponds d’après le briefing produit et, sur AGRON 1, d’après le tableau. Je ne remplace pas l’officier. Conseil seulement.",
  names:
    "StarWall est la plateforme. AGRON 1 est ce programme de quart. StarDome Inc. le construit. StarDome Container est la boîte d’acier. Pilot est le conseiller.",
  starlink:
    "Le quart porte deux Starlink — Maritime et Priority — verrou, latence, SNR et obstacle sur le même tableau. LIVE reste muet sans vrai satcom.",
  plans:
    "Plans publics : LIGHT, ADVANCED, INTELLIGENCE et CUSTOM. Le contenu est sur /pricing. Pas de montant ici. Le chiffre vient de celui qui écrit le contrat.",
  containers:
    "AGRON est l’acier : boîte d’environ 20 pieds, 9 500 kg, 10–15 kW, −30 à +50 °C, 72+ h, prête en moins de deux heures. StarDome est le système dedans. La détection tourne sur StarWall.",
  how: "Des adaptateurs lisent le radar, les caméras, l’AIS et le périmètre déjà là. Un tableau, une horloge. Risque : Normal, Attention, Elevated, Critical. À côté, l’étape suivante. L’appel reste au quart.",
  risk: "Quatre mots : Normal, Attention, Elevated, Critical. Le mot change, la raison est à côté. C’est un conseil, pas un ordre.",
  connections:
    "Les capteurs vont au cœur StarDome. Le cœur pousse le même tableau vers AGRON 1 et le Support Center. Carte : /interface/connections.",
  ais: "L’AIS est une source parmi d’autres. Il rejoint le même tableau que radar et caméras. Un contact sans AIS reste un contact. L’officier décide s’il appelle.",
  blackbox:
    "La Black Box écrit d’abord sur cet appareil. La copie cloud n’existe qu’après une écriture confirmée avec session. DEMO reste local tant que vous ne demandez pas autrement.",
  replace:
    "Non. StarWall lit ce qui est déjà payé — radar, caméras, navigation — par adaptateurs. Nous ne proposons pas de changer la passerelle.",
  offline:
    "Si une liaison tombe, StarWall continue en local et tamponne. Un satcom coupé n’éteint pas le tableau.",
};

const de: Record<PilotFactId, string> = {
  radarRange:
    "Das StarDome-3D-AESA-Radar deckt Luft und Oberfläche 360° bis 15 km. Das ist die Container-Suite, nicht die Ringe auf dem AGRON-1-Übungsbild. Business kann die Sensorreichweite strecken. Die Zahl für einen Rumpf nennt der Vertrag.",
  cameras:
    "Multispektrum-Kameras am Container: Tag, Nacht, Wärmebild und SWIR bis 10 km. Sie sitzen im selben Bild wie das Radar. Sie erfinden keinen Kontakt.",
  sonar:
    "Akustiksonar sieht unter Wasser etwa 1 km. Auf AGRON 1 steht es neben dem Radar. Was mit dem Kontakt geschieht, entscheidet die Wache.",
  spectrum:
    "Der Spektralanalysator überwacht RF und Signalaufklärung. Akustikradar nimmt niedrige, langsame, kleine Ziele. Beides speist StarWall. Nichts schießt von selbst.",
  sensors:
    "Suite: 3D-AESA bis 15 km, Kameras bis 10 km, Sonar bis 1 km, plus Akustikradar und Spektralanalysator. Alles läuft auf StarWall und landet auf AGRON 1. Die Wache entscheidet.",
  interceptors:
    "Abfangdrohnen auf manchen Stufen: ferngesteuert, etwa 200+ km/h, 20 km, 25 min. Sie starten nicht selbst. Ein lizenzierter Bediener gibt frei. Ortsrecht bleibt.",
  countermeasures:
    "Elektronische Kampfführung und Mikrowellenbucht sind optional, lizenziert und lösen nie selbst aus. StarWall kann raten. Die Wache gibt frei. Rechtsweg: /contact.",
  decides:
    "Kapitän oder Sicherheitsoffizier entscheidet. Pilot und AGRON 1 können den nächsten Schritt zeigen. Sie übernehmen die Wache nicht.",
  demoLive:
    "DEMO ist eine Übung mit erfundenem Verkehr. LIVE ist diese Anlage, wie sie steht — leer, bis Sensoren hängen. Leeres LIVE ist ehrlich.",
  pilotRole:
    "Ich bin Pilot, der Wachberater. Ich antworte aus der Produktlage und auf AGRON 1 aus dem aktuellen Bild. Ich ersetze den Offizier nicht. Nur Rat.",
  names:
    "StarWall ist die Plattform. AGRON 1 ist dieses Wachprogramm. StarDome Inc. baut es. StarDome Container ist der Stahlkasten. Pilot ist der Berater.",
  starlink:
    "Die Wache führt zwei Starlink-Dienste — Maritime und Priority — mit Lock, Latenz, SNR und Hindernis auf einem Brett. LIVE bleibt stumm ohne echtes Satcom.",
  plans:
    "Öffentliche Stufen: LIGHT, ADVANCED, INTELLIGENCE und CUSTOM. Inhalt steht auf /pricing. Keine Summe auf der Seite. Die Zahl nennt, wer den Vertrag schreibt.",
  containers:
    "AGRON ist der Stahl: etwa 20-Fuß-Kasten, 9 500 kg, 10–15 kW, −30 bis +50 °C, 72+ h, bereit unter zwei Stunden. StarDome ist das System darin. Erfassung läuft auf StarWall.",
  how: "Adapter lesen Radar, Kameras, AIS und Perimeter, die schon stehen. Ein Bild, eine Uhr. Risiko: Normal, Attention, Elevated, Critical. Daneben der nächste Schritt. Der Ruf bleibt bei der Wache.",
  risk: "Vier Wörter: Normal, Attention, Elevated, Critical. Wechselt das Wort, sitzt der Grund daneben. Rat für die Wache, kein Befehl.",
  connections:
    "Sensoren gehen in den StarDome-Kern. Der Kern schiebt dasselbe Bild zu AGRON 1 und zum Support Center. Karte: /interface/connections.",
  ais: "AIS ist eine Quelle unter anderen. Es landet im selben Bild wie Radar und Kameras. Ein Kontakt ohne AIS bleibt ein Kontakt. Der Offizier entscheidet, ob er ruft.",
  blackbox:
    "Die Black Box schreibt zuerst auf diesem Gerät. Die Cloud-Kopie gibt es erst nach bestätigtem Schreiben mit Sitzung. DEMO bleibt lokal, bis Sie etwas anderes verlangen.",
  replace:
    "Nein. StarWall liest, was schon bezahlt ist — Radar, Kameras, Navigation — über Adapter. Eine neue Brücke verlangen wir nicht.",
  offline:
    "Fällt eine Leitung, arbeitet StarWall lokal weiter und puffert. Ein totes Satcom löscht das Bild nicht.",
};

const uk: Record<PilotFactId, string> = {
  radarRange:
    "3D AESA-радар StarDome дивиться повітря і поверхню на 360°, до 15 км. Це межа комплекту на контейнері, не кільця на навчальній картині AGRON 1. Business може збільшити дальність. Цифру для конкретного корпусу називає контракт.",
  cameras:
    "Мультиспектральні камери контейнера — день, ніч, тепловізор і SWIR до 10 км. Вони в тій самій картині, що й радар. Контакт самі не вигадують.",
  sonar:
    "Акустичний сонар дивиться під воду приблизно до 1 км. На AGRON 1 він поруч із радаром. Що робити з контактом — вирішує вахта.",
  spectrum:
    "Спектральний аналізатор веде радіорозвідку. Акустичний радар ловить низькі, повільні, малі цілі. Обидва живлять StarWall. Самі нічого не вмикають.",
  sensors:
    "Комплекс: 3D AESA до 15 км, камери до 10 км, сонар до 1 км, плюс акустичний радар і аналізатор. Усе на StarWall і на AGRON 1. Рішення за вахтою.",
  interceptors:
    "Перехоплювачі на окремих рівнях — дистанційні БПЛА, близько 200+ км/год, до 20 км, до 25 хв. Самі не злітають. Ліцензований оператор дозволяє.",
  countermeasures:
    "РЕБ і мікрохвильовий відсік — опція, за ліцензією, самі не спрацьовують. StarWall може порадити. Вмикає людина на вахті. Правовий шлях — /contact.",
  decides:
    "Вирішує капітан або офіцер охорони. Pilot і AGRON 1 можуть показати наступний крок. Вахту не забирають.",
  demoLive:
    "DEMO — навчання з вигаданим трафіком. LIVE — ця установка як є: порожня, доки датчики не підключені. Порожній LIVE — чесно.",
  pilotRole:
    "Я Pilot, радник вахти. Відповідаю з брифінгу продукту і, на AGRON 1, з поточної картини. Офіцера не замінюю. Лише порада.",
  names:
    "StarWall — платформа. AGRON 1 — ця програма вахти. StarDome Inc. її будує. StarDome Container — сталева скриня. Pilot — радник.",
  starlink:
    "На зв’язку два Starlink — Maritime і Priority: захват, затримка, SNR і затінення на одній дошці. У LIVE канал мовчить без справжнього satcom.",
  plans:
    "Відкриті рівні: LIGHT, ADVANCED, INTELLIGENCE і CUSTOM. Що входить — на /pricing. Суми на сайті немає. Цифру називає той, хто пише контракт.",
  containers:
    "AGRON — сталь: приблизно 20-футова скриня, близько 9 500 кг, 10–15 кВт, −30…+50 °C, 72+ год, готовність менше двох годин. StarDome — система всередині.",
  how: "Адаптери читають радар, камери, AIS і периметр, що вже стоять. Одна картина, один годинник. Ризик: Normal, Attention, Elevated, Critical. Поруч — наступний крок.",
  risk: "Чотири слова: Normal, Attention, Elevated, Critical. Слово змінилось — причина поруч. Це порада вахті, не наказ.",
  connections:
    "Датчики йдуть у StarDome Core. Ядро жене ту саму картину на AGRON 1 і в Support Center. Схема — /interface/connections.",
  ais: "AIS — одна зі стрічок. Сідає на ту саму карту, що радар і камери. Контакт без AIS усе одно контакт. Викликати чи ні — вирішує офіцер.",
  blackbox:
    "Чорна скринька спочатку пише на цьому пристрої. Хмарна копія з’являється лише після підтвердженого запису під входом.",
  replace:
    "Ні. StarWall читає те, що вже куплено — радар, камери, навігацію — через адаптери. Міняти рубку цілком ми не пропонуємо.",
  offline:
    "Якщо лінк падає, StarWall працює локально і копичить. Один обірваний satcom картину не гасить.",
};

const ar: Record<PilotFactId, string> = {
  radarRange:
    "رادار StarDome ثلاثي الأبعاد AESA يغطي الجو والسطح 360° حتى 15 كم. هذا حد المجموعة على الحاوية، لا حلقات لوحة التمرين على AGRON 1. مستوى Business يمكن أن يزيد المدى. الرقم لهيكل بعينه يقوله العقد.",
  cameras:
    "كاميرات متعددة الأطياف: نهار وليل وحراري وSWIR حتى 10 كم. تدخل نفس الصورة مع الرادار. لا تخترع جهة اتصال.",
  sonar:
    "السونار الصوتي ينظر تحت الماء نحو 1 كم. على AGRON 1 بجانب الرادار. القرار يبقى للنوبة.",
  spectrum:
    "المحلل الطيفي يراقب الترددات والاستخبارات الإشارية. الرادار الصوتي يلتقط الأهداف المنخفضة البطيئة الصغيرة. كلاهما يغذي StarWall. لا يطلق شيئاً.",
  sensors:
    "المجموعة: AESA حتى 15 كم، كاميرات حتى 10 كم، سونار حتى 1 كم، مع رادار صوتي ومحلل طيفي. كلها على StarWall وتصل إلى AGRON 1. النوبة تقرر.",
  interceptors:
    "المعترضات على بعض المستويات طائرات مسيّرة عن بُعد، نحو 200+ كم/س، حتى 20 كم، 25 د. لا تقلع وحدها. مشغّل مرخّص يأذن.",
  countermeasures:
    "الحرب الإلكترونية والموجة الصغرية اختيارية ومرخّصة ولا تُشغَّل وحدها. StarWall قد يشير. الإنسان على النوبة يأذن. المسار القانوني: /contact.",
  decides:
    "القبطان أو ضابط الأمن يقرر. Pilot وAGRON 1 يمكن أن يُظهرا الخطوة التالية. لا يأخذان النوبة.",
  demoLive:
    "DEMO تمرين بحركة مخترعة. LIVE هذا التركيب كما هو — فارغ حتى تُوصل الحساسات. LIVE الفارغ صادق.",
  pilotRole:
    "أنا Pilot، مستشار النوبة. أجيب من إحاطة المنتج وعلى AGRON 1 من الصورة الحالية. لا أحل محل الضابط. نصيحة فقط.",
  names:
    "StarWall هي المنصة. AGRON 1 برنامج النوبة هذا. StarDome Inc. تبنيه. StarDome Container الصندوق الفولاذي. Pilot المستشار.",
  starlink:
    "على الاتصال خدمتا Starlink — Maritime وPriority — قفل وتأخير وSNR وعائق على لوحة واحدة. LIVE صامت بلا satcom حقيقي.",
  plans:
    "المستويات العامة: LIGHT وADVANCED وINTELLIGENCE وCUSTOM. المحتوى على /pricing. لا مبلغ هنا. الرقم يقوله من يكتب العقد.",
  containers:
    "AGRON هو الفولاذ: صندوق نحو 20 قدماً، حوالي 9500 كغ، 10–15 كو، −30 إلى +50°م، 72+ ساعة، جاهز في أقل من ساعتين. StarDome النظام داخله.",
  how: "محولات تقرأ الرادار والكاميرات وAIS والمحيط القائم. صورة واحدة، ساعة واحدة. الخطر: Normal وAttention وElevated وCritical. بجانبها الخطوة التالية.",
  risk: "أربع كلمات: Normal وAttention وElevated وCritical. تتغير الكلمة، السبب بجانبها. نصيحة للنوبة لا أمر.",
  connections:
    "الحساسات تدخل نواة StarDome. النواة تدفع الصورة نفسها إلى AGRON 1 وSupport Center. الخريطة: /interface/connections.",
  ais: "AIS مصدر واحد بين مصادر. يقع على نفس الصورة مع الرادار والكاميرات. جهة بلا AIS تبقى جهة. الضابط يقرر النداء.",
  blackbox:
    "الصندوق الأسود يكتب أولاً على هذا الجهاز. النسخة السحابية بعد كتابة مؤكدة بجلسة فقط.",
  replace:
    "لا. StarWall يقرأ ما دُفع ثمنه — رادار وكاميرات وملاحة — عبر محولات. لا نطلب استبدال الجسر.",
  offline:
    "إن سقط رابط، يعمل StarWall محلياً ويخزّن. satcom واحد مقطوع لا يطفئ الصورة.",
};

const zh: Record<PilotFactId, string> = {
  radarRange:
    "StarDome 三维 AESA 雷达覆盖空中与水面 360°，最远 15 公里。这是集装箱套件的上限，不是 AGRON 1 演练画面上的距离环。Business 可加长传感器距离。具体船体数字由合同写明。",
  cameras:
    "集装箱多光谱相机覆盖昼、夜、热成像与 SWIR，最远 10 公里。与雷达同一画面。不会自己编造目标。",
  sonar:
    "声学声呐看水下约 1 公里。在 AGRON 1 上与雷达并列。如何处置目标由值班决定。",
  spectrum:
    "频谱分析仪做射频与信号情报。声学雷达抓低慢小目标和水面扰动。都送进 StarWall。不会自行开火。",
  sensors:
    "套件：三维 AESA 至 15 公里、相机至 10 公里、声呐至 1 公里，外加声学雷达与频谱仪。全部跑在 StarWall，落到 AGRON 1。值班做决定。",
  interceptors:
    "部分级别的拦截无人机遥控，约 200+ 公里/时，最远 20 公里，续航 25 分钟。不会自己起飞。持证操作员授权。",
  countermeasures:
    "电子战与微波舱是可选项、需许可，从不自行触发。StarWall 可以建议。值班的人授权。法律路径：/contact。",
  decides:
    "船长或安保官决定。Pilot 与 AGRON 1 可以给出下一步。他们不接值班。",
  demoLive:
    "DEMO 是编造交通的演练。LIVE 是本安装的真实状态——传感器未接就是空的。空的 LIVE 是诚实，不是故障。",
  pilotRole:
    "我是 Pilot，值班顾问。按产品简报回答，在 AGRON 1 上按当前画面回答。不代替军官。只给建议。",
  names:
    "StarWall 是平台。AGRON 1 是本值班程序。StarDome Inc. 建造。StarDome Container 是钢箱。Pilot 是顾问。",
  starlink:
    "值班通信有两条 Starlink：Maritime 与 Priority，锁定、时延、SNR 与遮挡在同一块板上。没有真实卫星链路时 LIVE 保持离线。",
  plans:
    "公开级别：LIGHT、ADVANCED、INTELLIGENCE、CUSTOM。内容在 /pricing。本站不报金额。数字由写合同的人给出。",
  containers:
    "AGRON 是钢：约 20 英尺箱、约 9500 公斤、10–15 千瓦、−30 到 +50°C、72+ 小时、两小时内就绪。StarDome 是箱内系统。探测跑在 StarWall。",
  how: "适配器读取现场已有的雷达、相机、AIS 与周界。一幅图、一个钟。风险：Normal、Attention、Elevated、Critical。旁边是下一步。呼叫仍归值班。",
  risk: "四个词：Normal、Attention、Elevated、Critical。词变了，原因就在旁边。这是给值班的建议，不是命令。",
  connections:
    "传感器进入 StarDome 核心。核心把同一画面推到 AGRON 1 与 Support Center。拓扑在 /interface/connections。",
  ais: "AIS 只是其中一路。与雷达、相机落在同一画面。没有 AIS 的目标仍是目标。军官决定是否呼叫。",
  blackbox:
    "黑匣子先写在本机。云副本只在登录确认写入后出现。DEMO 记录先留在本地。",
  replace:
    "不。StarWall 通过适配器读取已经买下的雷达、相机、导航。我们不要求换掉驾驶台。",
  offline:
    "链路断了，StarWall 仍在本地工作并缓存。一条卫星中断不会关掉画面。",
};

const ja: Record<PilotFactId, string> = {
  radarRange:
    "StarDome の 3D AESA レーダーは空と水面を 360°、最大 15 km 見ます。コンテナ一式の上限であり、AGRON 1 の訓練画面の距離環ではありません。Business はセンサ距離を延ばせます。その船体の数字は契約が示します。",
  cameras:
    "コンテナのマルチスペクトルカメラは昼夜・熱・SWIR で最大 10 km。レーダーと同じ絵に入ります。目標を作りません。",
  sonar:
    "音響ソナーは水中をおよそ 1 km。AGRON 1 ではレーダーの隣です。どうするかは当直が決めます。",
  spectrum:
    "スペクトル分析は RF と信号情報を見ます。音響レーダーは低く遅く小さい目標を拾います。どちらも StarWall に入ります。勝手に撃ちません。",
  sensors:
    "一式は 3D AESA 15 km、カメラ 10 km、ソナー 1 km、音響レーダーとスペクトル分析です。StarWall 上で AGRON 1 に着きます。判断は当直です。",
  interceptors:
    "一部段階の迎撃 UAV は遠隔、約 200+ km/h、最大 20 km、25 分。自分では飛びません。免許のある操作者が許可します。",
  countermeasures:
    "電子戦とマイクロ波は任意・許諾付きで、単独では作動しません。StarWall は助言できます。当直が許可します。法務は /contact。",
  decides:
    "決めるのは船長か保安士官です。Pilot と AGRON 1 は次の一手を示せます。当直は取りません。",
  demoLive:
    "DEMO は作り物の交通の訓練です。LIVE はこの装備のまま — センサ未接続なら空です。空の LIVE は正直です。",
  pilotRole:
    "私は Pilot、当直の助言者です。製品説明と、AGRON 1 では今の絵で答えます。士官の代わりにはなりません。助言だけです。",
  names:
    "StarWall は基盤。AGRON 1 がこの当直プログラム。StarDome Inc. が作ります。StarDome Container は鋼の箱。Pilot は助言者です。",
  starlink:
    "当直通信は Starlink の Maritime と Priority。ロック、遅延、SNR、遮蔽が同じ盤です。本物の satcom が無い LIVE は沈黙します。",
  plans:
    "公開段階は LIGHT、ADVANCED、INTELLIGENCE、CUSTOM。中身は /pricing。金額は出しません。数字は契約を書く人が言います。",
  containers:
    "AGRON は鋼：約 20 フィート、約 9,500 kg、10–15 kW、−30～+50°C、72+ 時間、2 時間以内に稼働。中のシステムが StarDome。探知は StarWall です。",
  how: "アダプタが既設のレーダー、カメラ、AIS、周囲を読みます。一枚の絵、一つの時計。リスクは Normal / Attention / Elevated / Critical。隣に次の一手。呼び出しは当直です。",
  risk: "四語：Normal、Attention、Elevated、Critical。語が変われば理由が隣にあります。当直への助言であり、命令ではありません。",
  connections:
    "センサは StarDome Core へ。コアは同じ絵を AGRON 1 と Support Center に出します。図は /interface/connections。",
  ais: "AIS は入力の一つです。レーダーやカメラと同じ絵に乗ります。AIS の無い物標も物標です。呼びかけるかは士官が決めます。",
  blackbox:
    "ブラックボックスはまずこの端末に書きます。クラウド写しはログイン済みの確定書き込みの後だけです。",
  replace:
    "いいえ。StarWall は既に買ってあるレーダー、カメラ、航海計器をアダプタで読みます。ブリッジの総取替えは提案しません。",
  offline:
    "回線が落ちても StarWall はローカルで動き、溜めます。satcom 一本では絵は消えません。",
};

const he: Record<PilotFactId, string> = {
  radarRange:
    "מכ״ם AESA תלת־ממדי של StarDome מכסה אוויר ופני שטח ב־360° עד 15 ק״מ. זה גבול המערך במכולה, לא טבעות תרגול AGRON 1. Business יכול להאריך טווח. המספר לגוף מסוים נכתב בחוזה.",
  cameras:
    "מצלמות רב־ספקטרליות: יום, לילה, תרמי ו־SWIR עד 10 ק״מ. נכנסות לאותה תמונה עם המכ״ם. לא ממציאות מגע.",
  sonar:
    "סונאר אקוסטי רואה מתחת למים כ־1 ק״מ. ב־AGRON 1 ליד המכ״ם. מה לעשות עם המגע מחליטה המשמרת.",
  spectrum:
    "המנתח הספקטרלי עוקב אחרי RF ומודיעין אותות. מכ״ם אקוסטי תופס מטרות נמוכות איטיות קטנות. שניהם זנים את StarWall. לא יורים לבד.",
  sensors:
    "המערך: AESA עד 15 ק״מ, מצלמות עד 10 ק״מ, סונאר עד 1 ק״מ, ועוד מכ״ם אקוסטי ומנתח. הכול על StarWall ומגיע ל־AGRON 1. המשמרת מחליטה.",
  interceptors:
    "מיירטים בחלק מהרמות הם כטב״מים בשלט, כ־200+ קמ״ש, עד 20 ק״מ, 25 דק׳. לא ממריאים לבד. מפעיל מורשה מתיר.",
  countermeasures:
    "לוחמה אלקטרונית ומיקרוגל הם רשות, ברישיון, ולא מופעלים לבד. StarWall יכול לייעץ. מי שבמשמרת מתיר. המסלול המשפטי: /contact.",
  decides:
    "הקברניט או קצין הביטחון מחליט. Pilot ו־AGRON 1 יכולים להראות את הצעד הבא. הם לא לוקחים את המשמרת.",
  demoLive:
    "DEMO הוא תרגיל עם תנועה מומצאת. LIVE הוא ההתקנה כפי שהיא — ריקה עד חיבור חיישנים. LIVE ריק הוא כנה.",
  pilotRole:
    "אני Pilot, יועץ המשמרת. עונה מתדריך המוצר וב־AGRON 1 מהתמונה הנוכחית. לא מחליף את הקצין. ייעוץ בלבד.",
  names:
    "StarWall היא הפלטפורמה. AGRON 1 היא תוכנית המשמרת הזו. StarDome Inc. בונה. StarDome Container היא ארגז הפלדה. Pilot הוא היועץ.",
  starlink:
    "בקשר שני שירותי Starlink — Maritime ו־Priority — נעילה, השהיה, SNR ומכשול על אותו לוח. ב־LIVE השתיקה נשארת בלי satcom אמיתי.",
  plans:
    "רמות ציבוריות: LIGHT, ADVANCED, INTELLIGENCE ו־CUSTOM. מה כלול ב־/pricing. אין סכום באתר. המספר נאמר על ידי מי שכותב את החוזה.",
  containers:
    "AGRON הוא הפלדה: ארגז של כ־20 רגל, כ־9,500 ק״ג, 10–15 קילוואט, ‎−30 עד ‎+50°C, 72+ שעות, מוכן בפחות משעתיים. StarDome המערכת בפנים.",
  how: "מתאמים קוראים מכ״ם, מצלמות, AIS והיקף שכבר עומדים. תמונה אחת, שעון אחד. סיכון: Normal, Attention, Elevated, Critical. ליד זה הצעד הבא.",
  risk: "ארבע מילים: Normal, Attention, Elevated, Critical. המילה השתנתה — הסיבה לידה. זו עצה למשמרת, לא פקודה.",
  connections:
    "חיישנים נכנסים לליבת StarDome. הליבה דוחפת את אותה תמונה ל־AGRON 1 ול־Support Center. המפה: /interface/connections.",
  ais: "AIS הוא מקור אחד. נוחת על אותה תמונה עם מכ״ם ומצלמות. מגע בלי AIS עדיין מגע. הקצין מחליט אם לקרוא.",
  blackbox:
    "הקופסה השחורה כותבת קודם במכשיר הזה. העתק ענן רק אחרי כתיבה מאושרת עם כניסה.",
  replace:
    "לא. StarWall קורא מה שכבר שולם — מכ״ם, מצלמות, ניווט — דרך מתאמים. לא מבקשים להחליף גשר.",
  offline:
    "אם קישור נופל, StarWall ממשיך מקומית ואוגר. satcom אחד קטוע לא מכבה את התמונה.",
};

const books: Record<Locale, Record<PilotFactId, string>> = {
  en,
  es,
  fr,
  de,
  ru,
  uk,
  ar,
  zh,
  ja,
  he,
};

export function pilotFactText(id: PilotFactId, locale: Locale) {
  return books[locale][id];
}
