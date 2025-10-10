import { GooglePlacesSearchApiResponse } from "@/types";
import { transformPlaceResults } from "./utils";

// 返り値を統一
type ApiResult<T> = { data: T; error: null } | { data: null; error: string };

type TransformResult = Awaited<ReturnType<typeof transformPlaceResults>>;

// 近くのレストランを取得する
export async function fetchRestaurant(): Promise<ApiResult<TransformResult>> {
  const url = "https://places.googleapis.com/v1/places:searchNearby";

  const desiredTypes = [
    "japanese_restaurant",
    "cafe",
    "cafeteria",
    "coffee_shop",
    "chinese_restaurant",
    "fast_food_restaurant",
    "hamburger_restaurant",
    "french_restaurant",
    "italian_restaurant",
    "pizza_restaurant",
    "ramen_restaurant",
    "sushi_restaurant",
    "korean_restaurant",
    "indian_restaurant",
  ];

  const requestBody = {
    includedTypes: desiredTypes,
    maxResultCount: 10,
    locationRestriction: {
      circle: {
        center: {
          latitude: 35.6701286, // 表参道～原宿
          longitude: 139.7030912, // 表参道～原宿
        },
        radius: 500.0,
      },
    },
    languageCode: "ja",
    rankPreference: "DISTANCE",
  };

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error(`Missing environment variable:GOOGLE_API_KEY`);
  }

  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey,
    // transformPlaceResults で使う可能性のあるフィールドを明示
    "X-Goog-FieldMask":
      "places.id,places.displayName,places.primaryType,places.types,places.photos.name",
  };

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: header,
    next: { revalidate: 86400 }, // 24時間でキャッシュ更新
  });

  if (!response.ok) {
    // 失敗系は data:null / error:string
    try {
      const errorData = await response.json();
      console.error(errorData);
    } catch {
      // no-op
    }
    throw new Error(
      `response data Request failed :${response.status} ${response.statusText}`
    );
  }

  const data: GooglePlacesSearchApiResponse = await response.json();

  // places が無い場合は空配列（成功扱い）
  if (!data.places) {
    return { data: [], error: null };
  }

  const nearbyPlaces = data.places;

  const matchingPlaces = nearbyPlaces.filter(
    (place) => place.primaryType && desiredTypes.includes(place.primaryType)
  );

  console.log("matchingPlaces", matchingPlaces);

  const Restaurants = await transformPlaceResults(matchingPlaces);
  console.log("Restaurants", Restaurants);

  // 最後に必ず return
  return { data: Restaurants, error: null };
}
export async function fetchRamenRestaurant(): Promise<
  ApiResult<TransformResult>
> {
  const url = "https://places.googleapis.com/v1/places:searchNearby";

  const requestBody = {
    includedPrimaryTypes: ["ramen_restaurant"],
    maxResultCount: 10,
    locationRestriction: {
      circle: {
        center: {
          latitude: 35.6701286, // 表参道～原宿
          longitude: 139.7030912, // 表参道～原宿
        },
        radius: 500.0,
      },
    },
    languageCode: "ja",
    rankPreference: "DISTANCE",
  };

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    //Nextのエラー機能
    throw new Error(`Missing environment variable:GOOGLE_API_KEY`);
  }

  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey,
    // transformPlaceResults で使う可能性のあるフィールドを明示
    "X-Goog-FieldMask":
      "places.id,places.displayName,places.primaryType,places.types,places.photos.name",
  };

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: header,
    next: { revalidate: 86400 }, // 24時間でキャッシュ更新
  });

  if (!response.ok) {
    // 失敗系は data:null / error:string
    try {
      const errorData = await response.json();
      console.error(errorData);
    } catch {
      // no-op
    }
    throw new Error(
      `NearbySearch Request failed:${response.status} ${response.statusText}`
    );
  }

  const data: GooglePlacesSearchApiResponse = await response.json();

  // places が無い場合は空配列（成功扱い）
  if (!data.places) {
    return { data: [], error: null };
  }

  const nearbyRamenPlaces = data.places;
  const ramenRestaurants = await transformPlaceResults(nearbyRamenPlaces);
  console.log(data);

  // 最後に必ず return
  return { data: ramenRestaurants, error: null };
}

export async function getPhotoUrl(name: string, maxWidth = 400) {
  "use cache";
  const apiKey = process.env.GOOGLE_API_KEY;
  return `https://places.googleapis.com/v1/${name}/media?key=${apiKey}&maxWidthPx=${maxWidth}`;
}
