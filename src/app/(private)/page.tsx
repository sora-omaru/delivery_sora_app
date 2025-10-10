import CarouselContainer from "@/components/carousel-container";
import RestaurantCard from "@/components/restaurant-card";
import Section from "@/components/section";
import { fetchRamenRestaurant } from "@/lib/restaurant/api";

export default async function Home() {
  const { data: nearByRamenRestaurant, error } = await fetchRamenRestaurant();
  return (
    <>
      {!nearByRamenRestaurant ? (
        <p>{error}</p>
      ) : nearByRamenRestaurant.length > 0 ? (
        <Section title="近くのお店">
          <CarouselContainer slideToShow={4}>
            {nearByRamenRestaurant.map((restaurant, index) => (
              <RestaurantCard key={index} restaurant={restaurant} />
            ))}
          </CarouselContainer>
        </Section>
      ) : (
        <p>近くにラーメン店がありません</p>
      )}
    </>
  );
}
