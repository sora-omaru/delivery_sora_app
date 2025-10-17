import { GoogleAutocompleteApiResponse, RestaurantSuggestion } from "@/types";
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
      includeQueryPredictions: true,
      //サジェスチョン（ユーザーが入力している）
      //↑検索欄にユーザーが入力している途中の文字をもとに「候補を予測してくれる」もの
      input: input,
      sessionToken: sessionToken,
      includedPrimaryTypes: ["restaurant"],
      locationBias: {
        circle: {
          center: {
            latitude: 35.6701286, // 表参道～原宿
            longitude: 139.7030912, // 表参道～原宿
          },
          radius: 500.0,
        },
      },
      languageCode: "ja",
      // includedRegionCodes: ["jp"],
      regionCode: "jp",
      //こちらを使わないと  includeQueryPredictions: true,が適応しない。
      //厳密に日本のものを表示するわけではないが似たようなものだから適応する。
    };

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: header,
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
        `AutoComplete Search Request failed:${response.status} ${response.statusText}`
      );
    }
    const data: GoogleAutocompleteApiResponse = await response.json();
    console.log("data", JSON.stringify(data, null, 2));
    //undefinedもふくまれるためから配列を返すようにする
    //これを行うことで、suggestionsの中身を使えるようになる
    const suggestions = data.suggestions ?? [];

    //型に沿って使いやすい形に成型していく
    const results = suggestions
      .map((suggestion) => {
        if (suggestion.placePrediction && suggestion.placePrediction.placeId) {
          return {
            type: "placePrediction",
            placeId: suggestion.placePrediction.placeId,
            placeName:
              suggestion.placePrediction.structuredFormat?.mainText?.text,
          };
        } else if (
          suggestion.queryPrediction &&
          suggestion.queryPrediction.text?.text
        ) {
          return {
            type: "queryPrediction",
            placeName: suggestion.queryPrediction.text?.text,
          };
        }
      })
      //ここでfilterを行うことで、undefined出ない場合上記の処理を行うとなるため、型からundefinedがなくなる
      .filter(
        (suggestion): suggestion is RestaurantSuggestion =>
          suggestion !== undefined
      );

    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "予期せぬエラーが発生しました" });
  }
}
