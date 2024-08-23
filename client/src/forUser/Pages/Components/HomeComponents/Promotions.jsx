// src/components/Promotions.jsx
import React from 'react';
import Slider from 'react-slick';
import { promotions } from '../../../dumy/Data';

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

const Promotions = () => {
  return (
    <section className="p-8 bg-white shadow-md">
      <h2 className="text-2xl font-bold mb-4">Promotions</h2>
      <div className="relative">
        <div className="hidden md:block">
          {/* Grid layout for larger screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promo) => (
              <div key={promo.id} className="border rounded-lg overflow-hidden cursor-pointer">
                <img 
                  src={promo.image} 
                  alt={promo.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg md:text-xl font-semibold">{promo.title}</h3>
                  <p className="text-gray-600 text-sm md:text-base">{promo.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="md:hidden">
          {/* Slider for mobile screens */}
          <Slider {...sliderSettings}>
            {promotions.map((promo) => (
              <div key={promo.id} className="border rounded-lg overflow-hidden cursor-pointer">
                <img 
                  src={promo.image} 
                  alt={promo.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg md:text-xl font-semibold">{promo.title}</h3>
                  <p className="text-gray-600 text-sm md:text-base">{promo.description}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Promotions;
