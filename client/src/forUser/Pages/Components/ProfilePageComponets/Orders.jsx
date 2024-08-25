import React, { useState, useEffect} from 'react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import { useNavigate } from 'react-router';
import apiClient from '../../../../apiClient';

const Orders = ({ user }) => {
    const naviagte = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get(`/api/order/myorders/${user._id}`);
                setOrders(response.data);
            } catch (error) {
                toast.error(error.response.data.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const renderOrderSummary = () => (
        <div className="p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Order History</h2>
            {orders.length === 0 ? (
                <p>No orders yet!</p>
            ) : (
                <ul className="space-y-4">
                    {orders.map(order => (
                        <li
                            key={order._id}
                            className="border p-4 rounded-lg cursor-pointer hover:bg-gray-100 space-y-2"
                            onClick={() => naviagte(`/user/order/details/${order._id}`)} // Call the handler on click
                        >
                            {order.items.map((p) => (

                                    <div className="flex justify-between text-sm" key={p._id}>
                                <span><strong>Name:</strong> {p.product.name}</span>
                                <span><strong>Status:</strong> <span className='p-1 bg-gray-300'>{order.status}</span></span>
                                </div>

                            ))}
                             <span><strong>Order ID:</strong> {order._id}</span>
   <div className="text-sm text-gray-600 flex justify-between">
                                        <span><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</span>
                                        <span><strong>Total:</strong> ₹{order.payment.amount}</span>
                                    </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

    return (
        <>
            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="container mx-auto ">
                 
                        {renderOrderSummary()}
                </div>
            )}
        </>
    );
};

export default Orders;
