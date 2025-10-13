import Categories from "@/components/categories";
import RestaurantList from "@/components/restaurant-list";
import { fetchCategoryRestaurants } from "@/lib/restaurant/api";
import React from "react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ category: string }>;
}) {
  searchParams: {
    category: "sushi_restaurant";
  }
  const { category } = await searchParams;
  console.log("category", category);

  if (category) {
    const { data: categoryRestaurants, error: fetchError } =
      await fetchCategoryRestaurants(category);
    console.log("categoryRestaurant", categoryRestaurants);

    return (
      <>
        <div className="mb-4">
          <Categories />
        </div>
        {!categoryRestaurants ? (
          <p>{fetchError}</p>
        ) : categoryRestaurants.length > 0 ? (
          <RestaurantList restaurants={categoryRestaurants} />
        ) : (
          <p>
            カテゴリー<strong>{category}</strong>
            に一致するレストランが見つかりません
          </p>
        )}
      </>
    );
  }

  //   return <div>SearchPage</div>;
}
