import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import apiClient from '../../../../apiClient';

const CheckoutSuccess = () => {
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const sessionId = new URLSearchParams(window.location.search).get('session_id');

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) {
        setError('No session ID found');
        return;
      }

      try {
        const response = await apiClient.get(`/api/payment/checkout-session/${sessionId}`);
        const data = response.data;
        setSession(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!session) {
    return <div><LoadingSpinner /></div>;
  }

  // Calculate totals
  const shippingAmount = session.total_details.amount_shipping / 100;
  const amountPaid = session.amount_total / 100;
  const productCharges = amountPaid - shippingAmount; // Adjust based on your actual calculation

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-green-600 mb-1 text-center">Thank You for Your Purchase!</h1>
        <div className="border-t border-gray-300 my-6"></div>

        <div className="mb-1">
          <p className="text-xl font-semibold text-gray-800">Order ID:</p>
          <p className="text-lg text-gray-700 overflow-x-auto whitespace-nowrap">{session.id}</p>
        </div>

        <div className="mb-1 flex gap-2">
          <p className="text-xl font-semibold text-gray-800">Amount Paid:</p>
          <p className="text-lg text-gray-700">₹{amountPaid.toFixed(2)}</p>
        </div>

        <div className="mb-1 flex gap-2">
          <p className="text-xl font-semibold text-gray-800">Product Charges:</p>
          <p className="text-lg text-gray-700">₹{productCharges.toFixed(2)}</p>
        </div>

        <div className="mb-1 flex gap-2">
          <p className="text-xl font-semibold text-gray-800">Shipping Charges:</p>
          <p className="text-lg text-gray-700">₹{shippingAmount.toFixed(2)}</p>
        </div>

        <div className="border-t border-gray-300 my-6"></div>

        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Customer Information:</h2>
        <p className="text-lg text-gray-700 ">Name: {session.customer_details.name}</p>
        <p className="text-lg text-gray-700 ">Email: {session.customer_details.email}</p>
        <p className="text-lg text-gray-700 mb-4">Phone: {session.customer_details.phone}</p>

        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Shipping Address:</h2>
        <p className="text-lg text-gray-700 mb-2">Address1: {session.shipping_details.address.line1}</p>
        {session.shipping_details.address.line2 && <p className="text-lg text-gray-700 mb-2">{session.shipping_details.address.line2}</p>}
        <p className="text-lg text-gray-700 mb-2">City:{session.shipping_details.address.city}, {session.shipping_details.address.state}</p>
        <p className="text-lg text-gray-700 mb-2">Postal Code:{session.shipping_details.address.postal_code}</p>
        <p className="text-lg text-gray-700 mb-4">Country:{session.shipping_details.address.country}</p>
        <div className='flex justify-center'>
        <Link to={'/user/profile'} className='bg-green-500 p-2 rounded text-white'>My Orders</Link>
        </div>

      </div>
    </div> 
  );
};

export default CheckoutSuccess;
