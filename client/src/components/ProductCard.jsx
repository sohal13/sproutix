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
    
      className="bg-green-100 rounded-lg shadow-sm hover:scale-105 transition-transform duration-300 ease-in-out md:w-56 cursor-pointer"
    >
      <img
        src={product.image || '/placeholder.png'}
        alt={product.name}
        loading="lazy"
        width={300} // Placeholder width, adjust based on your layout
        height={200} // Placeholder height, adjust based on your layout
        className="w-full h-32 md:h-48 object-cover rounded-t"
      />
      <div className="p-1 bg-green-100 text-sm md:text-lg">
        <h2 className="font-semibold text-gray-800 truncate">{product.name}</h2>
        <p className="text-green-600 font-semibold">₹{product.price}</p>
        <p className="text-gray-500">{product.brand}</p>
      </div>
    </div>
  );
};

export default ProductCard;
