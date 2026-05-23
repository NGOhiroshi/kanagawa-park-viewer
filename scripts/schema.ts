/**
 * Single source of truth for park data schema.
 * Maps CSV columns (Japanese) → frontend keys (English) with category grouping.
 */

export const FACILITIES = [
  // 基本設備
  { key: "toilet", ja: "トイレ", category: "basic" },
  { key: "accessibleToilet", ja: "多目的トイレ", category: "basic" },
  { key: "water", ja: "水飲み・手洗い", category: "basic" },
  // 遊具
  { key: "springRider", ja: "スプリング遊具・スイング遊具", category: "playground" },
  { key: "sandbox", ja: "砂場", category: "playground" },
  { key: "combinedPlay", ja: "複合遊具", category: "playground" },
  { key: "fitnessEquip", ja: "健康器具", category: "playground" },
  { key: "swing", ja: "ブランコ", category: "playground" },
  { key: "slide", ja: "すべり台", category: "playground" },
  { key: "jungleGym", ja: "ジャングルジム", category: "playground" },
  { key: "horizontalBar", ja: "鉄棒", category: "playground" },
  { key: "seesaw", ja: "シーソー", category: "playground" },
  { key: "tarzanRope", ja: "ターザンロープ", category: "playground" },
  { key: "rollerSlide", ja: "ローラースライダー", category: "playground" },
  { key: "bouncyDome", ja: "ふわふわドーム", category: "playground" },
  // 広場
  { key: "lawn", ja: "芝生広場", category: "field" },
  { key: "waterPlay", ja: "水遊び", category: "field" },
  { key: "runningCourse", ja: "ランニングコース", category: "field" },
  // スポーツ
  { key: "tennis", ja: "テニスコート", category: "sports" },
  { key: "basketball", ja: "バスケットゴール", category: "sports" },
  { key: "baseball", ja: "野球場", category: "sports" },
  { key: "futsal", ja: "フットサル場", category: "sports" },
  { key: "soccer", ja: "サッカー場", category: "sports" },
  { key: "skatepark", ja: "スケートパーク", category: "sports" },
  { key: "pool", ja: "プール", category: "sports" },
  { key: "gym", ja: "体育館", category: "sports" },
  { key: "trackField", ja: "陸上競技場", category: "sports" },
  // 動物
  { key: "rabbits", ja: "ウサギ・モルモット", category: "animals" },
  { key: "hamsters", ja: "ハムスター", category: "animals" },
  { key: "chicks", ja: "ひよこ", category: "animals" },
  { key: "ponies", ja: "馬・ポニー", category: "animals" },
  // 飲食・売店
  { key: "cafe", ja: "カフェ・飲食施設", category: "food" },
  { key: "shop", ja: "売店", category: "food" },
  { key: "vendingMachine", ja: "自動販売機", category: "food" },
  { key: "bbq", ja: "バーベキュー場", category: "food" },
  // その他
  { key: "dogRun", ja: "ドッグラン", category: "other" },
  { key: "smokingArea", ja: "喫煙所", category: "other" },
  { key: "eventPlaza", ja: "イベント広場", category: "other" },
  { key: "evacuationSite", ja: "避難場所", category: "other" },
  // 駐車場
  { key: "freeParking", ja: "無料駐車場", category: "parking" },
  { key: "paidParking", ja: "有料駐車場", category: "parking" },
  { key: "bikeParking", ja: "駐輪場", category: "parking" },
] as const;

export type FacilityKey = (typeof FACILITIES)[number]["key"];
export type FacilityCategory = (typeof FACILITIES)[number]["category"];

export interface ParkBase {
  id: string;
  name: string;
  address: string;
  openedYear: number | null;
  areaSqm: number | null;
  parkType: string;
  facilities: Record<FacilityKey, boolean>;
  hours: string;
  closedDays: string;
  url: string;
  notes: string;
  updatedAt: string;
}

export interface Park extends ParkBase {
  lat: number | null;
  lng: number | null;
}
