import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaBoxOpen, FaFilter, FaSearch, FaEye, FaPhone } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../apiClient';

const OrderPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get('/api/order/seller/orders'); // Replace with your actual endpoint
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    setSelectedOrderId(orderId);
    setSelectedStatus(newStatus);
  };

  const confirmStatusUpdate = async () => {
    if (selectedOrderId && selectedStatus) {
      const confirmed = window.confirm(`Are you sure you want to update the status to ${selectedStatus}?`);
      if (confirmed) {
        try {
          // Assuming you have an API endpoint to update the order status
          await apiClient.put(`/api/seller/orders/${selectedOrderId}/status`, { status: selectedStatus });
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order._id === selectedOrderId ? { ...order, status: selectedStatus } : order
            )
          );
          setSelectedOrderId(null);
          setSelectedStatus(null);
        } catch (error) {
          console.error('Error updating order status:', error);
        }
      }
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filterStatus !== 'All' && order.status !== filterStatus) return false;
    if (searchTerm && !order.productName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Manage Your Orders</h1>

      <div className="max-w-full mx-auto bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FaFilter />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg p-2"
            >
              <option value="All">All</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <FaSearch />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product"
              className="border border-gray-300 rounded-lg p-2"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Product</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Price</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="border-b last:border-b-0">
                  <td className="p-4">
                    <img src={order.items[0].image} alt="Product" className="w-16 h-16 object-cover rounded-lg" />
                  </td>
                  <td className="p-4">{order.items[0].product.name}</td>
                  <td className="p-4">{order.items[0].quantity}</td>
                  <td className="p-4">₹{order.payment.amount}</td>
                  <td className="p-4">{order.shippingAddress.name}</td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="border border-gray-300 rounded-lg p-2"
                    >
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Canceled">Canceled</option>
                    </select>
                  </td>
                  <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button onClick={()=>navigate(`/seller/orders/detail/${order._id}`)} className="bg-blue-500 text-white rounded-lg p-2 flex items-center">
                        <FaEye className="mr-1" /> More Details
                      </button>
                      <button className="bg-green-500 text-white rounded-lg p-2 flex items-center">
                        <FaPhone className="mr-1" /> Contact Customer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center text-gray-600 mt-6">
            No orders match the selected criteria.
          </div>
        )}

        {selectedOrderId && (
          <div className="text-center mt-4">
            <button
              onClick={confirmStatusUpdate}
              className="bg-yellow-500 text-white rounded-lg p-2"
            >
              Confirm Status Update
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
