import CarouselContainer from "@/components/carousel-container";
import Categories from "@/components/categories";
import RestaurantCard from "@/components/restaurant-card";
import RestaurantList from "@/components/restaurant-list";
import Section from "@/components/section";
import { fetchRamenRestaurant, fetchRestaurant } from "@/lib/restaurant/api";

export default async function Home() {
  const { data: nearByRamenRestaurant, error: nearByRamenRestaurantError } =
    await fetchRamenRestaurant();
  const { data: nearRestaurant, error: nearByRestaurantError } =
    await fetchRestaurant();
  return (
    <>
      <Categories />
      {/*レストラン情報*/}
      {!nearRestaurant ? (
        <p>{nearByRestaurantError}</p>
      ) : nearRestaurant.length > 0 ? (
        <Section
          title="近くのレストラン"
          expandedContent={<RestaurantList restaurants={nearRestaurant} />}
        >
          <CarouselContainer slideToShow={4}>
            {nearRestaurant.map((restaurant, index) => (
              <RestaurantCard key={index} restaurant={restaurant} />
            ))}
          </CarouselContainer>
        </Section>
      ) : (
        <p>近くにレストランがありません</p>
      )}

      {/*ラーメン店情報*/}

      {!nearByRamenRestaurant ? (
        <p>{nearByRamenRestaurantError}</p>
      ) : nearByRamenRestaurant.length > 0 ? (
        <Section
          title="近くのラーメン屋"
          expandedContent={
            <RestaurantList restaurants={nearByRamenRestaurant} />
          }
        >
          <CarouselContainer slideToShow={4}>
            {nearByRamenRestaurant.map((restaurant, index) => (
              <RestaurantCard key={index} restaurant={restaurant} />
            ))}
          </CarouselContainer>
        </Section>
      ) : (
        <p>近くにラーメン屋がありません</p>
      )}
    </>
  );
}
