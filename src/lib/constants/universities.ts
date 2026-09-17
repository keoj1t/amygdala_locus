import { CampusImage, UniversityMeta } from "@/types/campus";

export interface UniversityDataset {
  meta: UniversityMeta;
  summary: string;
  keyHighlights: string[];
  images: CampusImage[];
}

export const KNOWN_UNIVERSITIES: Record<string, UniversityDataset> = {
  "nazarbayev-university": {
    meta: {
      id: "nazarbayev-university",
      name: "Nazarbayev University",
      nativeName: "Назарбаев Университет (NU)",
      city: "Астана (Astana)",
      country: "Казахстан",
      foundedYear: 2010,
      studentCount: "7,000+",
      website: "https://nu.edu.kz",
      logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=120&q=80",
      campusAcreage: "120 га",
      dormitoryInfo: {
        guaranteedForFreshmen: true,
        averageMonthlyCostKZT: 35000,
        averageMonthlyCostUSD: 75,
        roomTypes: ["1-местные", "2-местные блоки", "Семейные апартаменты"],
        distanceToCampus: "0 мин (соединен теплыми переходами Skywalk)",
      },
      livingCostInfo: {
        currency: "KZT",
        avgMealPrice: 2200,
        dormPriceRange: "25 000 - 45 000 ₸ / мес",
        publicTransportCost: 110,
        overallCostIndex: "Moderate",
      },
      transitInfo: {
        closestMetroOrBus: "Автобусы 10, 12, 51, 53, 303 (Остановка 'Назарбаев Университет')",
        walkabilityScore: 94,
        airportTransitTime: "15 мин на такси / 25 мин на автобусе 10/12",
      },
    },
    summary: "Nazarbayev University — флагманский автономный исследовательский университет мирового уровня в Астане. Главная особенность кампуса — грандиозный застекленный атриум 'Skywalk', связывающий все учебные блоки, лаборатории, общежития и спортивные комплексы в единое климатическое пространство, что позволяет комфортно учиться и жить зимой при -35°C.",
    keyHighlights: [
      "Крытый теплый переход 'Skywalk' длиной более 1.5 км",
      "Собственный легкоатлетический манеж, 50м олимпийский бассейн и фитнес-центр",
      "Более 150 исследовательских лабораторий с передовым оборудованием National Laboratory Astana",
      "Гарантированное комфортное проживание в общежитиях на территории кампуса"
    ],
    images: [
      {
        id: "nu-1",
        url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=85",
        title: "Главный вход и панорама главного корпуса NU",
        category: "campus",
        sourceUrl: "https://nu.edu.kz/about/campus",
        sourceDomain: "nu.edu.kz",
        publishDate: "2024-05-12",
        trustScore: 98,
        trustStatus: "verified",
        aiReasoning: "Официальный снимок архитектуры центрального атриума и башен NU. 100% совпадение с генеральным планом кампуса в Астане.",
        locationContext: "Блок С2, Проспект Кабанбай Батыра 53"
      },
      {
        id: "nu-2",
        url: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=85",
        title: "Центральный стеклянный атриум и студенческое общественное пространство",
        category: "campus",
        sourceUrl: "https://nu.edu.kz/campus-life/facilities",
        sourceDomain: "nu.edu.kz",
        publishDate: "2024-02-18",
        trustScore: 96,
        trustStatus: "verified",
        aiReasoning: "Узнаваемая футуристическая биофильная геометрия атриума NU с живыми пальмами и мостами перехода.",
        locationContext: "Центральный Атриум"
      },
      {
        id: "nu-3",
        url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=85",
        title: "Комната в студенческом общежитии (Блок 21)",
        category: "dorm",
        sourceUrl: "https://nu.edu.kz/admissions/student-housing",
        sourceDomain: "nu.edu.kz",
        publishDate: "2023-11-04",
        trustScore: 92,
        trustStatus: "verified",
        aiReasoning: "Стандартная двухместная комната в жилом блоке NU с индивидуальными рабочими местами и санузлом.",
        locationContext: "Студенческий городок, Корпус 21"
      },
      {
        id: "nu-4",
        url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85",
        title: "Лаборатория робототехники и искусственного интеллекта (ISSAI)",
        category: "lab",
        sourceUrl: "https://issai.nu.edu.kz/research-labs",
        sourceDomain: "issai.nu.edu.kz",
        publishDate: "2024-01-20",
        trustScore: 95,
        trustStatus: "verified",
        aiReasoning: "Оборудование и манипуляторы лаборатории института ISSAI при Школе инженерии и цифровых наук.",
        locationContext: "Школа Инженерии (SEDS), Блок 3"
      },
      {
        id: "nu-5",
        url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85",
        title: "Спортивный комплекс: олимпийский бассейн и тренажерный зал",
        category: "sport",
        sourceUrl: "https://nu.edu.kz/campus-life/sports-center",
        sourceDomain: "nu.edu.kz",
        publishDate: "2023-09-15",
        trustScore: 94,
        trustStatus: "verified",
        aiReasoning: "Спортивный центр Athletic Center NU: 50-метровый бассейн международного стандарта FINA.",
        locationContext: "Sports Center NU"
      },
      {
        id: "nu-6",
        url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=85",
        title: "Студенческая научная библиотека и зона для групповой работы",
        category: "student_life",
        sourceUrl: "https://library.nu.edu.kz/spaces",
        sourceDomain: "library.nu.edu.kz",
        publishDate: "2024-04-10",
        trustScore: 97,
        trustStatus: "verified",
        aiReasoning: "Читальный зал и мультимедийная зона библиотеки NU Library, открытая 24/7 во время экзаменов.",
        locationContext: "Блок 5, 2-3 этажи"
      },
      {
        id: "nu-7",
        url: "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=1200&q=85",
        title: "Кухня и лаундж-зона этажа в общежитии",
        category: "dorm",
        sourceUrl: "https://instagram.com/nu_studentlife",
        sourceDomain: "instagram.com",
        publishDate: "2023-12-01",
        trustScore: 78,
        trustStatus: "needs_check",
        aiReasoning: "Фото из студенческого блога. Интерьер соответствует жилым корпусам 24-27, но освещение любительское.",
        locationContext: "Dorm Lounge Block 24"
      },
      {
        id: "nu-8",
        url: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=85",
        title: "Окружение: EXPO 2017, ТРЦ Mega Silk Way и Ботанический сад рядом с кампусом",
        category: "city",
        sourceUrl: "https://visicastana.kz/district/yesil",
        sourceDomain: "visicastana.kz",
        publishDate: "2024-06-01",
        trustScore: 91,
        trustStatus: "verified",
        aiReasoning: "Район Есиль в Астане, прилегающий к кампусу NU. Сфера Нур-Алем и ТРЦ Mega Silk Way в 5 минутах ходьбы.",
        locationContext: "Район EXPO, проспект Мангилик Ел"
      },
      {
        id: "nu-9",
        url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85",
        title: "Фестиваль студенческих клубов и день открытых дверей",
        category: "student_life",
        sourceUrl: "https://tengrinews.kz/kazakhstan_news/nu-open-day-fest-2024",
        sourceDomain: "tengrinews.kz",
        publishDate: "2024-05-18",
        trustScore: 89,
        trustStatus: "verified",
        aiReasoning: "Репортаж TengriNews с ежегодного фестиваля студенческих организаций NU Student Government.",
        locationContext: "Main Plaza"
      },
      {
        id: "nu-10",
        url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85",
        title: "Студенческая резиденция - общий холл отдыха",
        category: "dorm",
        sourceUrl: "https://vk.com/nu_astana_dorms",
        sourceDomain: "vk.com",
        publishDate: "2023-08-20",
        trustScore: 68,
        trustStatus: "needs_check",
        aiReasoning: "Неофициальный паблик ВК. Планировка совпадает со старыми блоками общежитий NU, дата загрузки 2023.",
        locationContext: "Block 19 Common Room"
      },
      {
        id: "nu-11",
        url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=85",
        title: "Биомедицинская лаборатория и геномный центр National Laboratory Astana",
        category: "lab",
        sourceUrl: "https://nla.nu.edu.kz/en/facilities",
        sourceDomain: "nla.nu.edu.kz",
        publishDate: "2024-03-14",
        trustScore: 96,
        trustStatus: "verified",
        aiReasoning: "Чистые комнаты и секвенаторы NLA Life Sciences Center.",
        locationContext: "NLA Building 4"
      },
      {
        id: "nu-12",
        url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=85",
        title: "Крытое футбольное поле и теннисные корты",
        category: "sport",
        sourceUrl: "https://nu.edu.kz/campus-life/athletics",
        sourceDomain: "nu.edu.kz",
        publishDate: "2023-10-09",
        trustScore: 93,
        trustStatus: "verified",
        aiReasoning: "Крытый спортивный манеж со всепогодным покрытием на территории кампуса.",
        locationContext: "Athletic Arena"
      }
    ]
  },
  "astana-it-university": {
    meta: {
      id: "astana-it-university",
      name: "Astana IT University",
      nativeName: "Астана IT Университеті (AITU)",
      city: "Астана (Astana)",
      country: "Казахстан",
      foundedYear: 2019,
      studentCount: "5,500+",
      website: "https://astanait.edu.kz",
      logoUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=120&q=80",
      campusAcreage: "35 га (территория EXPO)",
      dormitoryInfo: {
        guaranteedForFreshmen: true,
        averageMonthlyCostKZT: 40000,
        averageMonthlyCostUSD: 85,
        roomTypes: ["2-местные", "3-местные", "Хостельного типа"],
        distanceToCampus: "5 мин пешком (в периметре EXPO)",
      },
      livingCostInfo: {
        currency: "KZT",
        avgMealPrice: 2000,
        dormPriceRange: "35 000 - 50 000 ₸ / мес",
        publicTransportCost: 110,
        overallCostIndex: "Moderate",
      },
      transitInfo: {
        closestMetroOrBus: "Автобусы 12, 18, 40, 47, 51, 53 (Остановка 'EXPO / AITU')",
        walkabilityScore: 96,
        airportTransitTime: "12 мин на такси",
      },
    },
    summary: "Astana IT University расположен в самом сердце инновационного кластера EXPO C1 в Астане, по соседству с Astana Hub. Кампус отличается высокотехнологичной IT-инфраструктурой, коворкингами от топовых техногигантов, киберспортивной ареной и современными смарт-лабораториями.",
    keyHighlights: [
      "Расположен прямо в павильонах EXPO рядом с технопарком Astana Hub",
      "Собственная киберспортивная арена и лаборатории GameDev / VR",
      "Инновационные лаборатории от Huawei, Cisco, Kaspersky и Apple",
      "Пешая доступность до ТРЦ Mega Silk Way и парка EXPO"
    ],
    images: [
      {
        id: "aitu-1",
        url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85",
        title: "Главный фасад здания AITU в кластере EXPO",
        category: "campus",
        sourceUrl: "https://astanait.edu.kz/about-campus",
        sourceDomain: "astanait.edu.kz",
        publishDate: "2024-03-22",
        trustScore: 97,
        trustStatus: "verified",
        aiReasoning: "Официальный снимок павильона С1 Astana IT University с корпоративным брендингом.",
        locationContext: "EXPO Pavilion C1, пр. Мангилик Ел 55/11"
      },
      {
        id: "aitu-2",
        url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=85",
        title: "Коворкинг и Open Space зона для хакатонов и стартапов",
        category: "student_life",
        sourceUrl: "https://astanait.edu.kz/innovation-spaces",
        sourceDomain: "astanait.edu.kz",
        publishDate: "2024-02-15",
        trustScore: 95,
        trustStatus: "verified",
        aiReasoning: "Центральный опенспейс хакатон-зоны AITU с брендированными пуфами и хаб-станциями.",
        locationContext: "Coworking Hall, 2nd Floor"
      },
      {
        id: "aitu-3",
        url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=85",
        title: "Студенческое общежитие AITU Дом студентов",
        category: "dorm",
        sourceUrl: "https://astanait.edu.kz/student-house",
        sourceDomain: "astanait.edu.kz",
        publishDate: "2023-09-01",
        trustScore: 91,
        trustStatus: "verified",
        aiReasoning: "Жилые комнаты современного Дома Студентов AITU в районе EXPO.",
        locationContext: "Student Dormitory Block A"
      },
      {
        id: "aitu-4",
        url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=85",
        title: "Лаборатория кибербезопасности и Cloud Computing",
        category: "lab",
        sourceUrl: "https://astanait.edu.kz/labs/cybersecurity",
        sourceDomain: "astanait.edu.kz",
        publishDate: "2024-01-10",
        trustScore: 96,
        trustStatus: "verified",
        aiReasoning: "Лаборатория Kaspersky & Cisco Cyber Defense Center при AITU.",
        locationContext: "Lab 304, IT Hub"
      },
      {
        id: "aitu-5",
        url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=85",
        title: "AITU Cybersport Arena & GameDev Center",
        category: "sport",
        sourceUrl: "https://astanait.edu.kz/cybersport",
        sourceDomain: "astanait.edu.kz",
        publishDate: "2023-11-20",
        trustScore: 93,
        trustStatus: "verified",
        aiReasoning: "Киберспортивный зал с игровыми станциями для турниров по Dota 2, CS2 и Valorant.",
        locationContext: "Cyber Arena Hall"
      },
      {
        id: "aitu-6",
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85",
        title: "Интерьер студенческой комнаты общежития",
        category: "dorm",
        sourceUrl: "https://instagram.com/aitu_life",
        sourceDomain: "instagram.com",
        publishDate: "2024-04-05",
        trustScore: 74,
        trustStatus: "needs_check",
        aiReasoning: "Снимок из аккаунта студенческого совета. Номер комнаты совпадает с планировкой корпуса B.",
        locationContext: "Dormitory Room 412"
      }
    ]
  },
  "satbayev-university": {
    meta: {
      id: "satbayev-university",
      name: "Satbayev University",
      nativeName: "Satbayev University (КазНИТУ)",
      city: "Алматы (Almaty)",
      country: "Казахстан",
      foundedYear: 1934,
      studentCount: "12,000+",
      website: "https://satbayev.university",
      logoUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=120&q=80",
      campusAcreage: "45 га (в центре Алматы)",
      dormitoryInfo: {
        guaranteedForFreshmen: true,
        averageMonthlyCostKZT: 25000,
        averageMonthlyCostUSD: 55,
        roomTypes: ["2-местные", "3-местные", "4-местные"],
        distanceToCampus: "3-7 мин пешком (ул. Сатпаева / Байтурсынова)",
      },
      livingCostInfo: {
        currency: "KZT",
        avgMealPrice: 1800,
        dormPriceRange: "20 000 - 35 000 ₸ / мес",
        publicTransportCost: 100,
        overallCostIndex: "Moderate",
      },
      transitInfo: {
        closestMetroOrBus: "Станция метро 'Байконур' (5 мин пешком), троллейбусы 7, 9, 11",
        walkabilityScore: 98,
        airportTransitTime: "30 мин на такси",
      },
    },
    summary: "Satbayev University (КазНИТУ им. К.И. Сатпаева) — старейший и ведущий технический университет Казахстана, расположенный в историческом центре Алматы у подножия Заилийского Алатау. Кампус сочетает монументальную архитектуру с передовыми инжиниринговыми FabLab и исследовательскими центрами горно-металлургического комплекса.",
    keyHighlights: [
      "Расположен в центре Алматы в 5 минутах от метро 'Байконур'",
      "Старейший политехнический вуз с богатой 90-летней историей",
      "Уникальные геологические и петрографические музеи и лаборатории",
      "Собственный спортивный комплекс и бассейн 'Политехник'"
    ],
    images: [
      {
        id: "sat-1",
        url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=85",
        title: "Главный исторический корпус Satbayev University (Нефтяной корпус)",
        category: "campus",
        sourceUrl: "https://satbayev.university/campus-tour",
        sourceDomain: "satbayev.university",
        publishDate: "2024-04-18",
        trustScore: 98,
        trustStatus: "verified",
        aiReasoning: "Монументальный фасад главного корпуса на ул. Сатпаева / Байтурсынова.",
        locationContext: "Главный корпус, ул. Сатпаева 22"
      },
      {
        id: "sat-2",
        url: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1200&q=85",
        title: "Инжиниринговый центр и цифровая лаборатория FabLab",
        category: "lab",
        sourceUrl: "https://satbayev.university/fablab",
        sourceDomain: "satbayev.university",
        publishDate: "2024-01-15",
        trustScore: 96,
        trustStatus: "verified",
        aiReasoning: "ЧПУ станки, 3D-принтеры промышленного уровня лаборатории FabLab Polytech.",
        locationContext: "Горно-металлургический корпус"
      },
      {
        id: "sat-3",
        url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=85",
        title: "Студенческое общежитие №2 (Дом Студентов)",
        category: "dorm",
        sourceUrl: "https://satbayev.university/dorms",
        sourceDomain: "satbayev.university",
        publishDate: "2023-10-12",
        trustScore: 92,
        trustStatus: "verified",
        aiReasoning: "Отреновированный жилой корпус для студентов на ул. Масанчи.",
        locationContext: "Общежитие №2, ул. Масанчи"
      },
      {
        id: "sat-4",
        url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=85",
        title: "Большая лекционная аудитория им. К. Сатпаева",
        category: "campus",
        sourceUrl: "https://satbayev.university/academic-halls",
        sourceDomain: "satbayev.university",
        publishDate: "2023-11-28",
        trustScore: 95,
        trustStatus: "verified",
        aiReasoning: "Амфитеатральная лекционная аудитория Главного учебного корпуса.",
        locationContext: "ГУК, Аудитория 300"
      },
      {
        id: "sat-5",
        url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85",
        title: "Вид на горы Заилийского Алатау и центр Алматы рядом с кампусом",
        category: "city",
        sourceUrl: "https://visitalmaty.kz/central-district",
        sourceDomain: "visitalmaty.kz",
        publishDate: "2024-05-10",
        trustScore: 93,
        trustStatus: "verified",
        aiReasoning: "Панорама на Медеу и Кок-Тобе из окон верхних этажей Горного корпуса.",
        locationContext: "Центральный район Алматы"
      },
      {
        id: "sat-6",
        url: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=85",
        title: "Студенческая столовая и кофе-бар",
        category: "student_life",
        sourceUrl: "https://2gis.kz/almaty/firm/satbayev_canteen",
        sourceDomain: "2gis.kz",
        publishDate: "2023-09-18",
        trustScore: 71,
        trustStatus: "needs_check",
        aiReasoning: "Пользовательский отзыв 2ГИС. Интерьер соответствует столовой корпуса ГМК.",
        locationContext: "Campus Food Court"
      }
    ]
  },
  "mit": {
    meta: {
      id: "mit",
      name: "Massachusetts Institute of Technology (MIT)",
      nativeName: "MIT (Кембридж / Бостон)",
      city: "Cambridge / Boston, MA",
      country: "США",
      foundedYear: 1861,
      studentCount: "11,900+",
      website: "https://mit.edu",
      logoUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=120&q=80",
      campusAcreage: "168 акров (68 га) вдоль реки Чарльз",
      dormitoryInfo: {
        guaranteedForFreshmen: true,
        averageMonthlyCostKZT: 750000,
        averageMonthlyCostUSD: 1600,
        roomTypes: ["Single", "Double", "Suite", "Historic House"],
        distanceToCampus: "0-10 мин пешком вдоль реки Чарльз",
      },
      livingCostInfo: {
        currency: "USD",
        avgMealPrice: 18,
        dormPriceRange: "$1,200 - $2,100 / mo",
        publicTransportCost: 2.4,
        overallCostIndex: "High",
      },
      transitInfo: {
        closestMetroOrBus: "MBTA Red Line (Kendall/MIT Station)",
        walkabilityScore: 99,
        airportTransitTime: "15 мин на метро/такси до Logan Airport",
      },
    },
    summary: "MIT — мировой лидер в области технологий, инженерии и фундаментальных наук. Знаменитый кампус вдоль реки Чарльз объединяет культовый купол 'Great Dome', футуристический Центр Стата архитектора Фрэнка Гери, медиа-лабораторию MIT Media Lab и более сотни мировых исследовательских центров.",
    keyHighlights: [
      "Культовый Great Dome (Building 10) с видом на реку Чарльз и Бостон",
      "Stata Center (Building 32) авторства Фрэнка Гери",
      "MIT Media Lab и Центр ядерных исследований",
      "Прямой выход к технологическому хабу Kendall Square"
    ],
    images: [
      {
        id: "mit-1",
        url: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=1200&q=85",
        title: "MIT Great Dome и Киллиан Корт (Killian Court)",
        category: "campus",
        sourceUrl: "https://news.mit.edu/campus-tour",
        sourceDomain: "news.mit.edu",
        publishDate: "2024-05-01",
        trustScore: 99,
        trustStatus: "verified",
        aiReasoning: "Классический исторический фасад Великого Купола MIT Building 10.",
        locationContext: "77 Massachusetts Ave, Cambridge"
      },
      {
        id: "mit-2",
        url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=85",
        title: "Лаборатория квантовых вычислений и нанотехнологий MIT.nano",
        category: "lab",
        sourceUrl: "https://mitnano.mit.edu/facilities",
        sourceDomain: "mitnano.mit.edu",
        publishDate: "2024-02-11",
        trustScore: 98,
        trustStatus: "verified",
        aiReasoning: "Чистые комнаты комплекса MIT.nano Building 12.",
        locationContext: "MIT.nano Facility"
      },
      {
        id: "mit-3",
        url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=85",
        title: "Студенческая резиденция Simmons Hall ('The Sponge')",
        category: "dorm",
        sourceUrl: "https://studentlife.mit.edu/housing/simmons-hall",
        sourceDomain: "studentlife.mit.edu",
        publishDate: "2023-10-15",
        trustScore: 95,
        trustStatus: "verified",
        aiReasoning: "Стивен Холл дизайн резиденции Simmons Hall MIT.",
        locationContext: "Simmons Hall, 229 Vassar St"
      },
      {
        id: "mit-4",
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
        title: "Набережная реки Чарльз и вид на скайлайн Бостона",
        category: "city",
        sourceUrl: "https://cambridgeusa.org/mit-riverfront",
        sourceDomain: "cambridgeusa.org",
        publishDate: "2024-06-12",
        trustScore: 97,
        trustStatus: "verified",
        aiReasoning: "Вид с набережной кампуса MIT через реку Чарльз на Бостон.",
        locationContext: "Charles River Esplanade"
      }
    ]
  }
};

export const POPULAR_SUGGESTIONS = [
  { name: "Nazarbayev University", query: "nazarbayev-university", country: "Казахстан", city: "Астана", tag: "Флагманский кампус" },
  { name: "Astana IT University", query: "astana-it-university", country: "Казахстан", city: "Астана", tag: "EXPO IT-Кластер" },
  { name: "Satbayev University", query: "satbayev-university", country: "Казахстан", city: "Алматы", tag: "Технический лидер" },
  { name: "Massachusetts Institute of Technology (MIT)", query: "mit", country: "США", city: "Кембридж", tag: "Global #1 Tech" },
  { name: "Al-Farabi Kazakh National University (КазНУ)", query: "kaznu", country: "Казахстан", city: "Алматы", tag: "КазГУград" },
  { name: "KIMEP University", query: "kimep", country: "Казахстан", city: "Алматы", tag: "Бизнес & Экономика" },
  { name: "Suleyman Demirel University (SDU)", query: "sdu", country: "Казахстан", city: "Каскелен", tag: "Зеленый кампус" },
  { name: "Harvard University", query: "harvard", country: "США", city: "Кембридж", tag: "Лига плюща" },
  { name: "Stanford University", query: "stanford", country: "США", city: "Пало-Альто", tag: "Кремниевая долина" },
  { name: "University of Oxford", query: "oxford", country: "Великобритания", city: "Оксфорд", tag: "Исторический" }
];
