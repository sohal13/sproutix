import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaTruck, FaUser, FaBoxOpen, FaMoneyCheck, FaShippingFast } from 'react-icons/fa';
import axios from 'axios';


const OrderDetail = () => {
  const { id } = useParams(); // Get order ID from the URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`/api/order/orderdetail/${id}`); // Replace with your actual endpoint
        setOrder(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) return <div className="text-center mt-8">Loading...</div>;

  if (!order) return <div className="text-center mt-8">No order details found.</div>;

  return (
    <div className="bg-gray-100 min-h-screen py-4 px-2 sm:px-2 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-3">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Order Details</h1>

        {/* Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Customer Information */}
          <div className="bg-blue-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2 flex items-center">
              <FaUser className="mr-2" /> Customer Information
            </h2>
            <p><strong>Name:</strong> {order.user.name}</p>
            <p><strong>Email:</strong> {order.user.email}</p>
            <p><strong>Phone:</strong> {order.user.phone}</p>
          </div>

          {/* Shipping Address */}
          <div className="bg-green-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2 flex items-center">
              <FaShippingFast className="mr-2" /> Shipping Address
            </h2>
            <p><strong>Name:</strong> {order.shippingAddress.name}</p>
            <p><strong>Address:</strong> {order.shippingAddress.addressLine1}, {order.shippingAddress.addressLine2}</p>
            <p><strong>City:</strong> {order.shippingAddress.city}</p>
            <p><strong>State:</strong> {order.shippingAddress.state}</p>
            <p><strong>Postal Code:</strong> {order.shippingAddress.postalCode}</p>
            <p><strong>Country:</strong> {order.shippingAddress.country}</p>
            <p><strong>Phone:</strong> {order.shippingAddress.phone}</p>
            <p><strong>Email:</strong> {order.shippingAddress.email}</p>
            <p><strong>Shipping Amount:</strong> ₹{order.shippingAddress.shipping_amount}</p>
          </div>
        </div>

        {/* Products */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 flex items-center">
            <FaBoxOpen className="mr-2" /> Products
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">Product</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index} className="border-b last:border-b-0">
                    <td className="p-4">
                      <img src={item.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg" />
                    </td>
                    <td className="p-4">{item.product.name}</td>
                    <td className="p-4">{item.quantity}</td>
                    <td className="p-4">₹{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-yellow-100 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2 flex items-center">
            <FaMoneyCheck className="mr-2" /> Payment Information
          </h2>
          <p><strong>Payment Method:</strong> {order.payment.method}</p>
          <p><strong>Total Amount:</strong> ₹{order.payment.amount}</p>
          {order.payment.stripe && (
            <>
              <p><strong>Stripe Payment Intent ID:</strong> {order.payment.stripe.paymentIntentId}</p>
              <p className='overflow-x-auto'><strong>Stripe Charge ID:</strong> {order.payment.stripe.chargeId}</p>
              <p><strong>Receipt:</strong> <a href={order.payment.stripe.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Receipt</a></p>
            </>
          )}
        </div>

        {/* Order Status */}
        <div className="bg-red-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 flex items-center">
            <FaTruck className="mr-2" /> Order Status
          </h2>
          <p><strong>Current Status:</strong> {order.status}</p>
          <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
