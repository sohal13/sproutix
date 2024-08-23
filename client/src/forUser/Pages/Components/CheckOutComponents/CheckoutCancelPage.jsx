import React from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutCancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="cancel-container p-4 md:p-8 text-center">
      <h1 className="text-2xl font-semibold mb-4">Payment Cancelled</h1>
      <p className="mb-4">Your payment was cancelled. Please try again.</p>
      <button
        onClick={() => navigate('/cart')}
        className="bg-red-500 text-white px-4 py-2 rounded-lg"
      >
        Return to Cart
      </button>
    </div>
  );
};

export default CheckoutCancelPage;
