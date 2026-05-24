import type { FacilityKey, FacilityCategory } from "../domain/park/Park";

export type Locale = "ja" | "en";

export interface AppTranslations {
  loading: string;

  topBar: {
    findParks: string;
    findParksAria: string;
    parksCount: (n: number) => string;
    locationGranted: string;
    locationDenied: string;
    locationGet: string;
    aboutApp: string;
    settings: string;
  };

  search: {
    panelAria: string;
    title: string;
    nameLabel: string;
    namePlaceholder: string;
    clearName: string;
    filterTitle: string;
    matching: (n: number) => string;
    total: (n: number) => string;
    clearAll: string;
    clearAllFacilities: (n: number) => string;
    resetAria: string;
    closePanel: string;
    viewList: (n: number) => string;
    viewListAria: (n: number) => string;
    andOrGroupLabel: string;
    andMeaning: string;
    orMeaning: string;
  };

  list: {
    ariaLabel: string;
    title: (n: number) => string;
    fromPrefOffice: string;
    allowLocation: string;
    truncated: (shown: number, total: number) => string;
    activeFacilities: string;
  };

  card: {
    backToList: string;
    backToListAria: string;
    close: (name: string) => string;
    address: string;
    unknownAddress: string;
    hours: string;
    closedDays: string;
    area: string;
    focusMap: string;
    focusMapAria: (name: string) => string;
    navigate: string;
    navigateAria: (name: string) => string;
    officialSite: string;
    officialSiteAria: (name: string) => string;
    facilities: string;
    facilitiesAria: string;
  };

  map: {
    ariaLabel: (n: number) => string;
  };

  settings: {
    title: string;
    closeAria: string;
    language: string;
    japanese: string;
    english: string;
  };

  categories: Record<FacilityCategory, string>;
  facilityNames: Record<FacilityKey, string>;

  about: {
    title: string;
    backToMap: string;
    backToMapAria: string;
    overviewHeading: string;
    overviewText: string;
    features: string[];
    dataHeading: string;
    parkDataTitle: string;
    parkDataText: string;
    source: string;
    license: string;
    count: string;
    countValue: string;
    note: string;
    noteText: string;
    mapTilesTitle: string;
    mapTilesText: string;
    geocodingTitle: string;
    geocodingText: string;
    techHeading: string;
    framework: string;
    mapLib: string;
    hosting: string;
    dataProcessing: string;
    dataProcessingValue: string;
    feedbackHeading: string;
    feedbackText: string;
    copyright: string;
    disclaimer: string;
  };
}

const ja: AppTranslations = {
  loading: "公園データを読み込んでいます…",

  topBar: {
    findParks: "公園を探す",
    findParksAria: "公園を検索・絞り込む",
    parksCount: (n) => `${n}件の公園`,
    locationGranted: "現在地取得中",
    locationDenied: "位置情報がブロックされています",
    locationGet: "現在地を取得する",
    aboutApp: "このアプリについて",
    settings: "設定",
  },

  search: {
    panelAria: "公園フィルタ",
    title: "公園を探す",
    nameLabel: "公園名・住所で検索",
    namePlaceholder: "例: 境川、横浜市緑区...",
    clearName: "公園名の検索をクリア",
    filterTitle: "設備で絞り込む",
    matching: (n) => `条件に合う公園: ${n} 件`,
    total: (n) => `全 ${n} 件の公園`,
    clearAll: "すべてクリア",
    clearAllFacilities: (n) => `設備 ${n}件`,
    resetAria: "すべての絞り込み条件をリセット",
    closePanel: "検索パネルを閉じる",
    viewList: (n) => `${n}件の公園リストを見る →`,
    viewListAria: (n) => `${n}件の公園リストを距離順で見る`,
    andOrGroupLabel: "検索条件の組み合わせ方",
    andMeaning: "（すべて含む）",
    orMeaning: "（どれか含む）",
  },

  list: {
    ariaLabel: "公園リスト（距離順）",
    title: (n) => `${n}件の公園`,
    fromPrefOffice: "📍 神奈川県庁からの距離で表示しています",
    allowLocation: "📍 現在地を許可すると近い順で表示されます",
    truncated: (shown, total) => `※ 上位 ${shown} 件を表示しています（全 ${total} 件）`,
    activeFacilities: "絞り込み中の設備",
  },

  card: {
    backToList: "← リストに戻る",
    backToListAria: "公園リストに戻る",
    close: (name) => `${name} の詳細を閉じる`,
    address: "住所",
    unknownAddress: "不明",
    hours: "開園時間",
    closedDays: "休園日",
    area: "面積",
    focusMap: "🗺️ 地図でフォーカス",
    focusMapAria: (name) => `${name} の位置を地図でフォーカス`,
    navigate: "ナビ ↗",
    navigateAria: (name) => `${name} をGoogle Mapsで開く（新しいタブ）`,
    officialSite: "公式 ↗",
    officialSiteAria: (name) => `${name} の公式ページを開く（新しいタブ）`,
    facilities: "設備",
    facilitiesAria: "設備一覧",
  },

  map: {
    ariaLabel: (n) => `神奈川県の公園マップ。${n}件を表示中。`,
  },

  settings: {
    title: "設定",
    closeAria: "設定を閉じる",
    language: "言語",
    japanese: "日本語",
    english: "English",
  },

  categories: {
    basic: "基本設備",
    playground: "遊具",
    field: "広場",
    sports: "スポーツ",
    animals: "動物",
    food: "飲食・売店",
    other: "その他",
    parking: "駐車場",
  },

  facilityNames: {
    toilet: "トイレ",
    accessibleToilet: "多目的トイレ",
    water: "水飲み・手洗い",
    springRider: "スプリング遊具・スイング遊具",
    sandbox: "砂場",
    combinedPlay: "複合遊具",
    fitnessEquip: "健康器具",
    swing: "ブランコ",
    slide: "すべり台",
    jungleGym: "ジャングルジム",
    horizontalBar: "鉄棒",
    seesaw: "シーソー",
    tarzanRope: "ターザンロープ",
    rollerSlide: "ローラースライダー",
    bouncyDome: "ふわふわドーム",
    lawn: "芝生広場",
    waterPlay: "水遊び",
    runningCourse: "ランニングコース",
    tennis: "テニスコート",
    basketball: "バスケットゴール",
    baseball: "野球場",
    futsal: "フットサル場",
    soccer: "サッカー場",
    skatepark: "スケートパーク",
    pool: "プール",
    gym: "体育館",
    trackField: "陸上競技場",
    rabbits: "ウサギ・モルモット",
    hamsters: "ハムスター",
    chicks: "ひよこ",
    ponies: "馬・ポニー",
    cafe: "カフェ・飲食施設",
    shop: "売店",
    vendingMachine: "自動販売機",
    bbq: "バーベキュー場",
    dogRun: "ドッグラン",
    smokingArea: "喫煙所",
    eventPlaza: "イベント広場",
    evacuationSite: "避難場所",
    freeParking: "無料駐車場",
    paidParking: "有料駐車場",
    bikeParking: "駐輪場",
  },

  about: {
    title: "このアプリについて",
    backToMap: "← 地図に戻る",
    backToMapAria: "地図に戻る",
    overviewHeading: "概要",
    overviewText:
      "神奈川公園ビューワーは、神奈川県内の公園を設備条件で手軽に絞り込める検索アプリです。「ブランコ AND 砂場」のようなニッチな複合条件で目的の公園をすぐに見つけられます。",
    features: [
      "設備 AND/OR 複合検索（42種類の設備）",
      "公園名・住所からのテキスト検索",
      "地図上でのクラスター表示",
      "ログイン不要・インストール不要（PWA）",
    ],
    dataHeading: "データについて",
    parkDataTitle: "公園データ",
    parkDataText: "神奈川県が公開する「都市公園台帳（整備記録）」オープンデータを使用しています。",
    source: "提供元",
    license: "ライセンス",
    count: "件数",
    countValue: "約 8,094 件（2026年5月時点）",
    note: "注意",
    noteText:
      "データは自治体への届出情報に基づくため、実際の設備状況と異なる場合があります。最新情報は各公園の管理者にご確認ください。",
    mapTilesTitle: "地図タイル",
    mapTilesText: "地図表示には国土地理院が提供する地理院タイルを使用しています。",
    geocodingTitle: "ジオコーディング",
    geocodingText:
      "住所から緯度経度への変換（ジオコーディング）には、国土地理院の住所検索 API を使用しています。",
    techHeading: "技術",
    framework: "フレームワーク",
    mapLib: "地図ライブラリ",
    hosting: "ホスティング",
    dataProcessing: "データ処理",
    dataProcessingValue: "クライアント側全件フィルタ（DB・APIサーバー不要）",
    feedbackHeading: "フィードバック",
    feedbackText: "データの誤りや機能のご要望は、GitHubのIssueからお知らせください。",
    copyright: "© 2026 神奈川公園ビューワー",
    disclaimer: "このサービスは神奈川県・国土地理院とは無関係の個人プロジェクトです。",
  },
};

const en: AppTranslations = {
  loading: "Loading park data…",

  topBar: {
    findParks: "Find Parks",
    findParksAria: "Search and filter parks",
    parksCount: (n) => `${n} parks`,
    locationGranted: "Location active",
    locationDenied: "Location blocked",
    locationGet: "Get current location",
    aboutApp: "About this app",
    settings: "Settings",
  },

  search: {
    panelAria: "Park filter",
    title: "Find Parks",
    nameLabel: "Search by name or address",
    namePlaceholder: "e.g. Sakaigawa, Midori-ku...",
    clearName: "Clear name search",
    filterTitle: "Filter by facility",
    matching: (n) => `Matching parks: ${n}`,
    total: (n) => `All ${n} parks`,
    clearAll: "Clear all",
    clearAllFacilities: (n) => `${n} facilities`,
    resetAria: "Reset all filters",
    closePanel: "Close search panel",
    viewList: (n) => `View ${n} parks →`,
    viewListAria: (n) => `View ${n} parks sorted by distance`,
    andOrGroupLabel: "How to combine conditions",
    andMeaning: "(must have all)",
    orMeaning: "(has any)",
  },

  list: {
    ariaLabel: "Park list (by distance)",
    title: (n) => `${n} parks`,
    fromPrefOffice: "📍 Showing distance from Kanagawa Prefectural Office",
    allowLocation: "📍 Allow location access to sort by nearest",
    truncated: (shown, total) => `Showing top ${shown} of ${total} parks`,
    activeFacilities: "Active filters",
  },

  card: {
    backToList: "← Back to list",
    backToListAria: "Back to park list",
    close: (name) => `Close details for ${name}`,
    address: "Address",
    unknownAddress: "Unknown",
    hours: "Hours",
    closedDays: "Closed",
    area: "Area",
    focusMap: "🗺️ Focus on map",
    focusMapAria: (name) => `Focus ${name} on map`,
    navigate: "Navigate ↗",
    navigateAria: (name) => `Open ${name} in Google Maps (new tab)`,
    officialSite: "Official ↗",
    officialSiteAria: (name) => `Open official page for ${name} (new tab)`,
    facilities: "Facilities",
    facilitiesAria: "Facility list",
  },

  map: {
    ariaLabel: (n) => `Kanagawa park map. Showing ${n} parks.`,
  },

  settings: {
    title: "Settings",
    closeAria: "Close settings",
    language: "Language",
    japanese: "日本語",
    english: "English",
  },

  categories: {
    basic: "Basic",
    playground: "Play Equipment",
    field: "Open Areas",
    sports: "Sports",
    animals: "Animals",
    food: "Food & Shops",
    other: "Other",
    parking: "Parking",
  },

  facilityNames: {
    toilet: "Restroom",
    accessibleToilet: "Accessible Restroom",
    water: "Water Fountain",
    springRider: "Spring / Swing Rider",
    sandbox: "Sandbox",
    combinedPlay: "Combined Play Structure",
    fitnessEquip: "Fitness Equipment",
    swing: "Swing",
    slide: "Slide",
    jungleGym: "Jungle Gym",
    horizontalBar: "Horizontal Bar",
    seesaw: "Seesaw",
    tarzanRope: "Tarzan Rope",
    rollerSlide: "Roller Slide",
    bouncyDome: "Bouncy Dome",
    lawn: "Lawn Area",
    waterPlay: "Water Play",
    runningCourse: "Running Course",
    tennis: "Tennis Court",
    basketball: "Basketball Court",
    baseball: "Baseball Field",
    futsal: "Futsal Court",
    soccer: "Soccer Field",
    skatepark: "Skatepark",
    pool: "Pool",
    gym: "Gymnasium",
    trackField: "Track & Field",
    rabbits: "Rabbits & Guinea Pigs",
    hamsters: "Hamsters",
    chicks: "Chicks",
    ponies: "Horses & Ponies",
    cafe: "Café / Restaurant",
    shop: "Shop",
    vendingMachine: "Vending Machine",
    bbq: "Barbecue Area",
    dogRun: "Dog Run",
    smokingArea: "Smoking Area",
    eventPlaza: "Event Plaza",
    evacuationSite: "Evacuation Site",
    freeParking: "Free Parking",
    paidParking: "Paid Parking",
    bikeParking: "Bicycle Parking",
  },

  about: {
    title: "About",
    backToMap: "← Back to map",
    backToMapAria: "Back to map",
    overviewHeading: "Overview",
    overviewText:
      "Kanagawa Park Viewer is a search app that lets you easily filter parks in Kanagawa Prefecture by facility conditions. Find exactly the park you need with niche compound conditions like \"Swings AND Sandbox.\"",
    features: [
      "Facility AND/OR compound search (42 facility types)",
      "Text search by park name or address",
      "Cluster display on map",
      "No login or installation required (PWA)",
    ],
    dataHeading: "Data",
    parkDataTitle: "Park Data",
    parkDataText:
      "Uses the \"Urban Park Register (Development Records)\" open data published by Kanagawa Prefecture.",
    source: "Source",
    license: "License",
    count: "Count",
    countValue: "Approx. 8,094 parks (as of May 2026)",
    note: "Note",
    noteText:
      "Data is based on information filed with local governments, so actual facility conditions may differ. Please confirm the latest information with each park's management.",
    mapTilesTitle: "Map Tiles",
    mapTilesText:
      "Map display uses Geographic Survey Institute tiles provided by the Geospatial Information Authority of Japan.",
    geocodingTitle: "Geocoding",
    geocodingText:
      "Address-to-coordinate conversion uses the Geospatial Information Authority of Japan address search API.",
    techHeading: "Technology",
    framework: "Framework",
    mapLib: "Map Library",
    hosting: "Hosting",
    dataProcessing: "Data Processing",
    dataProcessingValue: "Client-side full filtering (no DB or API server needed)",
    feedbackHeading: "Feedback",
    feedbackText: "Please report data errors or feature requests via GitHub Issues.",
    copyright: "© 2026 Kanagawa Park Viewer",
    disclaimer:
      "This service is an independent project unaffiliated with Kanagawa Prefecture or the Geospatial Information Authority of Japan.",
  },
};

export const translations: Record<Locale, AppTranslations> = { ja, en };
