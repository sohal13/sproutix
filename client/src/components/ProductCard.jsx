// src/components/ProductCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';


const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  return (
    <div key={product._id} onClick={()=>navigate(`/product/${product._id}`)} className="bg-white rounded-lg shadow-sm hover:scale-105 md:w-56">
      <img
        src={product.image || '/placeholder.png'}
        alt={product.name}
        loading="lazy"
        className="w-full h-32 md:h-48 object-cover rounded-t self-center"
      />
      <div className='p-1 bg-green-100 text-sm md:text-lg w-full'>
      <h2 className=" font-semibold">{product.name}</h2>
      <p className="text-green-600 font-semibold">₹{product.price}</p>
      <p className="text-gray-500">{product.brand}</p>
      </div>
     
    </div>
  );
};

export default ProductCard;
