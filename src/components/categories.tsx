"use client";

import React from "react";
import CarouselContainer from "./carousel-container";
import Category from "./category";
import { useRouter, useSearchParams } from "next/navigation";

export interface CategoryType {
  categoryName: string;
  type: string;
  imageUrl: string;
}

export default function Categories() {
  //ここで今回絞るカテゴリーを定義する
  const categories: CategoryType[] = [
    {
      categoryName: "ファーストフード",
      type: "fast_food_restaurant",
      imageUrl: "/images/categories/ファーストフード.png",
    },
    {
      categoryName: "日本料理",
      type: "japanese_restaurant",
      imageUrl: "/images/categories/日本料理.png",
    },
    {
      categoryName: "ラーメン",
      type: "ramen_restaurant",

      imageUrl: "/images/categories/ラーメン.png",
    },
    {
      categoryName: "寿司",
      type: "sushi_restaurant",
      imageUrl: "/images/categories/寿司.png",
    },
    {
      categoryName: "中華料理",
      type: "chinese_restaurant",

      imageUrl: "/images/categories/中華料理.png",
    },
    {
      categoryName: "コーヒ-",
      type: "cafe",
      imageUrl: "/images/categories/コーヒー.png",
    },
    {
      categoryName: "イタリアン",
      type: "italian_restaurant",
      imageUrl: "/images/categories/イタリアン.png",
    },
    {
      categoryName: "フランス料理",
      type: "french_restaurant",
      imageUrl: "/images/categories/フレンチ.png",
    },

    {
      categoryName: "ピザ",
      type: "pizza_restaurant",
      imageUrl: "/images/categories/ピザ.png",
    },

    {
      categoryName: "韓国料理",
      type: "korean_restaurant",
      imageUrl: "/images/categories/韓国料理.png",
    },
    {
      categoryName: "インド料理",
      type: "indian_restaurant",
      imageUrl: "/images/categories/インド料理.png",
    },
  ];

  ///search?category=fast_food_restaurantみたいなことをするための処理
  const searchParams = useSearchParams();
  const route = useRouter();
  //URLの中からcategoryを取り出す(この後にHomeに戻るように使う)
  const currentCategory = searchParams.get("category");

  //カテゴリーを絞って検索する処理
  const searchRestaurantsOfCategory = (category: string) => {
    const params = new URLSearchParams(searchParams);

    //現在指定しているカテゴリーと同じものを選んだ場合、Homeへ戻るようにする
    if (currentCategory === category) {
      route.replace("/");
    } else {
      params.set("category", category);
      route.replace(`/search?${params.toString()}`);
    }
  };

  return (
    <CarouselContainer slideToShow={10}>
      {categories.map((category) => (
        <Category
          key={category.type}
          category={category}
          onClick={searchRestaurantsOfCategory}
          select ={category.type === currentCategory}
        />
      ))}
    </CarouselContainer>
  );
}
