"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper components
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/grid";
import { useGetAllProductcategoryQuery } from "../redux-tookit/services/authApi";
import SearchInput from "../component/SearchInput";
import { useRouter } from "next/navigation";

const Page = () => {
  const { data } = useGetAllProductcategoryQuery();
  const router = useRouter();

  const handleNavigation = (url) => {
    router.push(url);
  };

  return (
    <div className="container mx-auto">
      {/* Search Input Section */}
      <div className="mb-6 mx-auto py-2 lg:py-8 flex justify-center relative">
        <SearchInput />
        <button
            onClick={() => router.back()}
            className=" absolute  right-0 text-lg lg:text-xl mt-2 mr-0 lg:mr-2 text-gray-600 hover:text-gray-900"
          >
            ✖
          </button>
      </div>

      {/* Category Section */}
      <div className="border-t-2">
        <div className="text-center my-1 lg:my-6">
          <h2 className="text-2xl font-bold">Browse Categories</h2>
        </div>

        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          navigation={true} // Add navigation arrows
          breakpoints={{
            640: {
              slidesPerView: 2, // On small screens, show 2 slides
            },
            768: {
              slidesPerView: 3, // On medium screens, show 3 slides
            },
            1024: {
              slidesPerView: 6, // On larger screens, show 6 slides
            },
          }}
        >
          {data?.category?.map((cat, index) => {
            return (
              <SwiperSlide key={index} className="flex items-center justify-center">
                <div
                  className="flex flex-col items-center cursor-pointer group"
                  onClick={() => handleNavigation(`/products?category=${cat?._id}`)}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-64 w-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <p className="pt-2 text-center uppercase text-sm font-semibold">
                    {cat?.name}
                  </p>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default Page;
