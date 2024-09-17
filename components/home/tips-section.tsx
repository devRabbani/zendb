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
import { Card, CardContent } from "../ui/card";

const dbTips = [
  "Always backup your database before making major changes.",
  "Use indexes to improve query performance on frequently accessed columns.",
  "Normalize your database to reduce data redundancy and improve data integrity.",
  "Regularly update your database software to ensure security and performance.",
  "Use prepared statements to prevent SQL injection attacks.",
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati totam repellendus saepe fuga ut non consequuntur omnis aut! Magni, laborum. Nihil minima sunt iure ab labore voluptatem inventore dicta corporis animi cupiditate. Maiores natus amet cupiditate doloremque harum autem laboriosam, corrupti facilis aliquam veritatis vero vel perspiciatis quidem unde? Ab.",
];

export default function TipsSection() {
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));
  return (
    <section className="bg-secondary rounded-md dark:bg-transparent">
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
          {dbTips.map((tip, index) => (
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
    </section>
  );
}
