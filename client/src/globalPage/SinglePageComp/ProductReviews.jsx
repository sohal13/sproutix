import React from 'react';

const ProductReviews = ({ reviews }) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
      {reviews.map((review, index) => (
        <div key={index} className="mb-4">
          <h3 className="font-bold">{review.user.name}</h3>
          <p>{review.comment}</p>
          <div className="text-yellow-500">Rating: {review.rating}/5</div>
        </div>
      ))}
    </div>
  );
};

export default ProductReviews;
