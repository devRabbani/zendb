"use client";

import { useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { CardContent } from "../ui/card";

export default function TipsCarousal({ tips }: { tips: string[] }) {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  return (
    <Carousel
      opts={{
        loop: true,
      }}
      plugins={[plugin.current]}
      className="w-full mx-auto max-w-2xl"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {tips.map((tip, index) => (
          <CarouselItem key={index}>
            <div className="p-3 h-full">
              <div className="h-full">
                <CardContent className="flex h-full items-center justify-center p-6">
                  <span className="text-xl text-center font-semibold">
                    {tip}
                  </span>
                </CardContent>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
