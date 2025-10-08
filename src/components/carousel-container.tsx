import React, { ReactNode } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CarouselContainerProps {
  children: ReactNode[];
  slideToShow: number;
}

export default function CarouselContainer({
  children,
  slideToShow,
}: CarouselContainerProps) {
  return (
    <Carousel className="w-full">
      <CarouselContent className="-ml-1">
        {children.map((child, index) => (
          <CarouselItem key={index} style={{flexBasis:`${100/slideToShow}%`}}>
            <div className="p-1">{child}</div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
