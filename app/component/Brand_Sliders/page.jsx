"use client";
import Image from "next/image";
import './style.scss';
import { useState } from 'react';

const images = [
  '/assets/images/puma.png',
  '/assets/images/uspolo.png',
  '/assets/images/zara.png',
  '/assets/images/levis.png',
  '/assets/images/hnm.png',
  '/assets/images/zara.png'
];

export default function Carousel() {
  const reviews = [
    {
      name: 'Paul Starr',
      review:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa sit rerum incidunt, a consequuntur recusandae ab saepe illo est quia obcaecati neque quibusdam eius accusamus error officiis atque voluptates magnam!',
      image:
        'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80',
    },
    {
      name: 'Jack Michael',
      review:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa sit rerum incidunt, a consequuntur recusandae ab saepe illo est quia obcaecati neque quibusdam eius accusamus error officiis atque voluptates magnam!',
      image:
        'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80',
    },
    {
      name: 'John Doe',
      review:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa sit rerum incidunt, a consequuntur recusandae ab saepe illo est quia obcaecati neque quibusdam eius accusamus error officiis atque voluptates magnam!',
      image:
        'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const handleIndicatorClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <>
      <div className="carousel-container mx-auto text-center py-10">
        <div className="text-white">
          <h2 className="text-center text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6">
            Our <span className="font-satisfy text-primary">Brands</span> 
          </h2>
          {/* <span className="block text-center text-lg text-white mb-10">
            Up To <span className="text-primary">60% </span>off on Brands
          </span> */}
        </div>

        {/* Carousel Track */}
        <div className="carousel-track">
          {images.concat(images).map((src, index) => (
            <div key={index} className="slide">
              <Image
                src={src}
                width={300}
                height={200}
                alt={`Slide ${index + 1}`}
                className="carousel-image"
              />
            </div>
          ))}
        </div>

        {/* Customer Reviews Section */}
        <section className="fashionmate_reviews mt-10">
          <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <h2 className="text-center text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6">
              What Our <span className="font-satisfy text-primary">Customer</span> Say
            </h2>
            <span className="block text-center text-lg text-white mb-10">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non, deserunt!
            </span>

            {/* Review Cards */}
            <div className="carousel-review-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
              {reviews.map((review, index) => (
                <blockquote
                  key={index}
                  className="review-card bg-white p-6 rounded-lg shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <img
                      alt="Reviewer"
                      src={review.image}
                      className="review-image w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-0.5 text-green-500">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927a1 1 0 011.902 0l1.799 3.64 4.017.581a1 1 0 01.554 1.705l-2.907 2.833.686 4.004a1 1 0 01-1.45 1.054L10 15.347l-3.598 1.892a1 1 0 01-1.45-1.054l.686-4.004-2.907-2.833a1 1 0 01.554-1.705l4.017-.581 1.799-3.64z" />
                          </svg>
                        ))}
                      </div>
                      <p className="mt-0.5 text-lg font-medium text-gray-900">
                        {review.name}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-700">{review.review}</p>
                </blockquote>
              ))}
            </div>

            {/* Circle Indicators */}
            <div className="mt-6 flex justify-center space-x-3">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  className={`h-3 w-3 rounded-full ${
                    activeIndex === index ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  onClick={() => handleIndicatorClick(index)}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
