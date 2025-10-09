import { GooglePlacesSearchApiResponse } from "@/types";

export async function fetchRamenRestaurant() {
  //外部のAPIを利用する
  const url = "https://places.googleapis.com/v1/places:searchNearby";
  //こちらは半径500ｍ以内のものを取得するということ。
  //日本語のものを取得する
  const requestBody = {
    includedPrimaryTypes: ["ramen_restaurant"],
    maxResultCount: 10,
    locationRestriction: {
      circle: {
        center: {
          latitude: 35.6701286, //表参道～原宿
          longitude: 139.7030912, //表参道～原宿
        },
        radius: 500.0,
      },
    },
    languageCode: "ja",
    rankPreference: "DISTANCE",
  };

  const apiKey = process.env.Google_API_key;
  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey!,
    "X-Goog-FieldMask":
      "places.id,places.displayName,places.primaryType,places.photos",
  };

  const response = await fetch(url, {
    method: "POST",
    //上記のbodyをこちらに乗せて向こうのＤＢから取得する。
    body: JSON.stringify(requestBody),
    headers: header,
    next: { revalidate: 86400 }, //キャッシュからデータを取得するように設定する（24時間で更新する）
  });

  //ここでresponseのデータがない場合の例外処理を記入
  if (!response.ok) {
    const errorData = await response.json();
    console.error(errorData);
    return { error: `NearbySearchリクエスト失敗：${response.status}` };
  }
  //dataに型を与える
  const data: GooglePlacesSearchApiResponse = await response.json();
  console.log(data);

  if(!data.places){
    return{data:[]}
  }

  const nearbyRamenPlaces = data.places;
  transformPlaceResults(nearbyRamenPlaces);
}
