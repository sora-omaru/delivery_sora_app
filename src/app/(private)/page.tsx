import CarouselContainer from "@/components/carousel-container";
import RestaurantCard from "@/components/restaurant-card";
import Section from "@/components/section";
import { fetchRamenRestaurant } from "@/lib/restaurant/api";

export default async function Home() {
  await fetchRamenRestaurant();
  return (
    <Section title="近くのお店">
      <CarouselContainer slideToShow={4}>
        {Array.from({ length: 5 }).map((_, index) => (
          <RestaurantCard key={index} />
        ))}
      </CarouselContainer>
    </Section>
  );
}
