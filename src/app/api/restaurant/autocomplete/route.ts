import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  //ここでクエリパラメータの値を参照することができる
  const input = searchParams.get("input");
  const sessionToken = searchParams.get("sessionToken");

  console.log("input", input);
  console.log("sessionToken", sessionToken);

  if (!input) {
    NextResponse.json({ error: "文字を入力してください" }, { status: 400 });
  }
  if (!sessionToken) {
    NextResponse.json(
      { error: "セッショントークンは必須です" },
      { status: 400 }
    );
  }

  try {
    const url = "https://places.googleapis.com/v1/places:autocomplete";

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      //Nextのエラー機能
      throw new Error(`Missing environment variable:GOOGLE_API_KEY`);
    }

    const header = {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
    };

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
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "予期せぬエラーが発生しました" });
  }

  return NextResponse.json("success");
}
