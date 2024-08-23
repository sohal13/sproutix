import React from 'react';

const ProductPrice = ({ price, quantity }) => {
  return (
    <div className="mb-4">
      <h2 className="text-3xl font-bold text-green-600">${price}</h2>
     
    </div>
  );
};

export default ProductPrice;
