//dataに対して型を定義する。内容は開発者ツールにて確認可能。
export interface GooglePlacesSearchApiResponse {
  places?: PlaceSearchResult[];
}

export interface PlaceSearchResult {
  //idのみ確定であるからオプショナルな値にしない
  id: string;
  displayName?: {
    languageCode?: string;
    text?: string;
  };
  primaryType?: string;
  photos?: PlacePhoto[];
}

export interface PlacePhoto {
  name?: string;
}
