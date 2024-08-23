import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as faEmptyStar } from '@fortawesome/free-solid-svg-icons';

const renderStars = (averageRating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(averageRating)) {
      stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-yellow-500" />);
    } else if (i === Math.ceil(averageRating) && !Number.isInteger(averageRating)) {
      stars.push(<FontAwesomeIcon key={i} icon={faStarHalfAlt} className="text-yellow-500" />);
    } else {
      stars.push(<FontAwesomeIcon key={i} icon={faEmptyStar} className="text-gray-300" />);
    }
  }
  return stars;
};

const ProductInfo = ({ product }) => {

  return (
    <div className="p-1">
      <h1 className="text-2xl font-bold mb-1">{product?.name}</h1>
      {product?.scientificName && <p className="italic text-gray-500">{product?.scientificName}</p>}

            {/* Ratings */}
            <div className="mb-2">
        <div className="flex items-center">
          {renderStars(product.ratings.average)}
          <span className="ml-2 text-gray-700">({product.ratings.count} reviews)</span>
        </div>
      </div>

      {/* Price and Quantity */}
      <div className="flex gap-2 mb-1">
        <h2 className="font-semibold text-lg">Price</h2>
        <p className="text-green-600 text-xl font-bold">₹{product.price}</p>
      </div>
      {product.featured && (
        <div className="mb-1">
          <span className="px-2 py-1 bg-yellow-400 text-yellow-900 font-semibold rounded">Featured Product</span>
        </div>
      )}
        <div className="">
        <p className={product.quantity > 0 ? 'text-green-500' : 'text-red-500'}>
        {product.quantity > 0 ? 'in stock' : 'out of stock'}
      </p>
      </div>
      <p className="text-gray-700 mb-1">{product.description}</p>
      {/* Care Instructions */}
      {product.careInstructions && (
        <div className="mb-1">
          <h2 className="font-semibold text-lg">Care Instructions</h2>
          <p>{product.careInstructions}</p>
        </div>
      )}

      {/* Additional Requirements */}
      <div className="mb-1">
        {product.lightRequirement && (
          <div className='flex items-center gap-2'>
            <h2 className="font-semibold text-lg">Light Requirement</h2>
            <p>{product.lightRequirement}</p>
          </div>
        )}
        {product.waterRequirement && (
          <div className='flex gap-2 items-center'>
            <h2 className="font-semibold text-lg">Water Requirement</h2>
            <p>{product.waterRequirement}</p>
          </div>
        )}
        {product.soilType && (
          <div className='flex gap-2 items-center'>
            <h2 className="font-semibold text-lg">Soil Type</h2>
            <p>{product.soilType}</p>
          </div>
        )}
        {product.climate && (
          <div className='flex gap-2 items-center'>
            <h2 className="font-semibold text-lg">Suitable Climate</h2>
            <p>{product.climate}</p>
          </div>
        )}
      </div>
      {/* Category and Brand */}
      <div className="mb-1 flex gap-2 items-center">
        <h2 className="font-semibold text-lg">Category</h2>
        <p>{product.category}</p>
      </div>
      {product.brand && (
        <div className="mb-1 flex gap-2 items-center">
          <h2 className="font-semibold text-lg">Brand</h2>
          <p>{product.brand}</p>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
