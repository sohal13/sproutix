// src/components/PopularSellers.js
import React from 'react';
import Slider from 'react-slick';
import { popularSellers } from '../../../dumy/Data';

// Slick slider settings for mobile
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000, // Auto-slide every 3 seconds
};

const PopularSellers = () => {
  // Check if the screen width is below the threshold for mobile
  const isMobile = window.innerWidth < 768;

  return (
    <section className="p-8 bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">Popular Sellers</h2>
      <div className="relative">
        {isMobile ? (
          <Slider {...sliderSettings}>
            {popularSellers.map((seller) => (
              <div key={seller.id} className="border rounded-lg overflow-hidden cursor-pointer">
                <img 
                  src={seller.image} 
                  alt={seller.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg md:text-xl font-semibold">{seller.name}</h3>
                  <p className="text-gray-600 text-sm md:text-base">{seller.description}</p>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularSellers.map((seller) => (
              <div key={seller.id} className="border rounded-lg overflow-hidden cursor-pointer">
                <img 
                  src={seller.image} 
                  alt={seller.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg md:text-xl font-semibold">{seller.name}</h3>
                  <p className="text-gray-600 text-sm md:text-base">{seller.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularSellers;
