// src/components/HeroSection.jsx
import React from 'react';
import img from '../../../../assets/heroimg.png'

const HeroSection = () => {
  return (
    <section className="relative bg-green-600 p-8 flex flex-col md:flex-row items-center">
      {/* Text and Buttons */}
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Bring Nature Home
        </h1>
        <p className="text-lg md:text-xl text-green-100 mb-6">
          "Explore our vast collection of plants and find the perfect addition to your home or garden."
        </p>
        <div className="flex flex-col md:flex-row justify-center md:justify-start">
          <button className="bg-green-900 text-white py-2 px-6 rounded-full mb-2 md:mb-0 md:mr-4 hover:bg-green-700">
            Shop Now
          </button>
          <button className="bg-white text-green-600 border border-green-600 py-2 px-6 rounded-full hover:bg-green-50">
            Learn More
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="hidden flex-1 mt-6 md:mt-0 md:flex justify-center md:justify-end">
        <img
          src={img}
          alt="Beautiful Plants"
          className="w-full max-w-sm md:max-w-md object-cover"
        />
      </div>
    </section>
  );
};

export default HeroSection;
