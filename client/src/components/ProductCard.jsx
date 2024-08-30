// src/components/ProductCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div
    key={product._id}
    onClick={handleClick}
    role="button"
    tabIndex={0}
    className="group bg-white rounded-lg shadow-md hover:shadow-lg transform transition-transform duration-300 ease-in-out md:w-56 cursor-pointer overflow-hidden"
  >
    <div className="relative ease-in-out group-hover:scale-105">
      <img
        src={product.image || '/placeholder.png'}
        alt={product.name}
        loading="lazy"
        width={300}
        height={200}
        className="w-full h-32 md:h-48 object-cover rounded-t-lg transition-transform duration-300 "
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50 transition-opacity duration-300 ease-in-out group-hover:opacity-60"></div>
      <div className="absolute bottom-2 left-2 text-white font-semibold text-md md:text-lg">
        {product.name}
      </div>
    </div>
    <div className="p-2 bg-white">
      <p className="text-green-600 font-bold text-lg">₹{product.price}</p>
      <p className="text-gray-500 text-[12px]">{product.brand}</p>
      <button className="mt-2 w-full py-1 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-200 ease-in-out">
        View Details
      </button>
    </div>
  </div>
  
  
  );
};

export default ProductCard;
