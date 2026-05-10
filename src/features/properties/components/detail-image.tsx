"use client";
import { ExperienceImage } from "@/features/experiences/schemas/experience-schema";
import Image from "next/image";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

interface Props {
  images?: ExperienceImage[];
}
export default function DetailImageProperty({
  images = [],
}: Props): React.ReactNode {
  const [active, setActive] = useState(0);
  if (images.length === 0) {
    return (
      <div className="relative aspect-square md:hidden bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-[shimmer_1.5s_infinite] flex items-center justify-center"></div>
    );
  }

  return (
    <>
      {/* primary image for mobile */}
      <div className="relative md:hidden">
        <Swiper
          onSlideChange={(swiper) => setActive(swiper.activeIndex)}
          spaceBetween={0}
          slidesPerView={1}
          className="z-10"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="relative aspect-square overflow-hidden bg-gray-200">
                <Image
                  src={img.image_url}
                  alt="image"
                  fill
                  loading="eager"
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute bottom-10 z-100 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {active + 1} / {images.length}
        </div>
      </div>

      <div className="hidden container mx-auto md:grid grid-cols-4 grid-rows-2 gap-2 w-full h-113 px-10 md:px-0 mt-10 items-stretch ">
        <div className="row-span-2 col-span-2 bg-gray-100 rounded-l-2xl overflow-hidden group cursor-pointer">
          <Image
            loading="lazy"
            width={500}
            height={500}
            src={images[0].image_url}
            alt="main image"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="bg-amber-400 overflow-hidden group cursor-pointer">
          <Image
            width={500}
            height={500}
            src={images[1].image_url}
            alt="main image"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="bg-amber-400 rounded-tr-2xl overflow-hidden group cursor-pointer">
          <Image
            src={images[2].image_url}
            width={500}
            height={500}
            alt="main image"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="bg-amber-400 overflow-hidden group cursor-pointer">
          <Image
            width={500}
            height={500}
            src={images[3].image_url}
            alt="main image"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="bg-amber-400 rounded-br-2xl overflow-hidden group cursor-pointer">
          <Image
            width={500}
            height={500}
            src={images[4].image_url}
            alt="main image"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>
    </>
  );
}
