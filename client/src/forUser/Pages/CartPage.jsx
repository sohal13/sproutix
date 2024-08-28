import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';// Import your LoadingSpinner component
import { toast } from 'react-toastify';
import CheckoutPageButton from './Components/CheckOutComponents/CheckOutPageButton';
import Layout from './Components/Layout/Layout';
import apiClient from '../../apiClient';


const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const navigate = useNavigate();
  console.log(cart);
  // Fetch cart data from the backend
  const fetchCart = async () => {
    try {
      const response = await apiClient.get('/api/cart/get'); // 
      setCart(response.data);
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      await apiClient.put('/api/cart/update', { productId, quantity }); 
      fetchCart(); 
    } catch (err) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
        // Send the productId in the request body for DELETE requests
        const response = await apiClient.delete('/api/cart/remove', {
            data: { productId } // Use 'data' to send request body in DELETE request
        });
        fetchCart(); // Refresh cart data after removal
    } catch (err) {
        console.log(err);
        toast.error('Failed to remove item');
    }
};

  const handleClearCart = async () => {
    try {
      await apiClient.delete('/api/cart/clear'); 
      fetchCart(); // Refresh cart data after clearing
    } catch (err) {
      toast.error('Failed to clear cart');
    }
  };

  const handleApplyCoupon = async () => {
    try {
      await apiClient.post('/api/cart/apply-coupon', { couponCode }); 
      fetchCart(); // Refresh cart data after applying coupon
      setCouponCode('');
    } catch (err) {
      toast.error('Failed to apply coupon');
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await apiClient.post('/api/cart/remove-coupon'); // Replace with your API endpoint
      fetchCart(); // Refresh cart data after removing coupon
    } catch (err) {
      toast.error('Failed to remove coupon');
    }
  };
  const handleContinueShopping = () => {
    navigate('/');
  };


  return (
    <Layout>
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Shopping Cart</h1>
{loading ? (<LoadingSpinner />):(
  <>
   {!cart ? (
        <div className="text-center text-lg text-gray-600">
          <p>Your cart is empty</p>
          <button
            onClick={handleContinueShopping}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead className="bg-gray-100 border-b">
                <tr>
                <th className="py-3 px-4 text-left">image</th>
                  <th className="py-3 px-4 text-left">Product</th>
                  <th className="py-3 px-4 text-left">Price</th>
                  <th className="py-3 px-4 text-left">Quantity</th>
                  <th className="py-3 px-4 text-left">Subtotal</th>
                  <th className="py-3 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {cart?.items?.map((item) => (
                  <tr key={item.productId}>
                    <td className="py-4 px-4 flex items-center" onClick={()=>navigate(`/product/₹{item.productId}`)}>
                      <img src={item?.image[0]} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                    </td>
                    <td className="py-4 px-4">{item.name}</td>
                    <td className="py-4 px-4">₹{item.price.toFixed(2)}</td>
                    <td className="py-4 px-4">
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        className="w-24 px-2 py-1 border rounded-lg text-center"
                        onChange={(e) => handleUpdateQuantity(item.productId, +e.target.value)}
                      />
                    </td>
                    <td className="py-4 px-4">₹{item.subtotal.toFixed(2)}</td>
                    <td className="py-4 px-4">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveItem(item.productId)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col lg:flex-row justify-between items-start">
            <div className="mb-4 lg:mb-0">
              <div className="flex flex-col md:flex-row items-center mb-4 gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="px-4 py-2 border rounded-lg mr-2 w-full md:w-auto"
                />
                <div>
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Apply Coupon
                </button>
                <button
                  onClick={handleRemoveCoupon}
                  className="ml-2 px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-600"
                >
                  Remove Coupon
                </button>
                </div>
              
              </div>

              <div>
                <p className="text-lg font-semibold">Subtotal: ₹{cart?.totalAmount?.toFixed(2)}</p>
                {cart.discount > 0 && (
                  <p className="text-lg font-semibold text-green-500">Discount: -₹{cart?.discount?.toFixed(2)}</p>
                )}
                <p className="text-xl font-bold">Total: ₹{cart?.finalAmount?.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                <CheckoutPageButton product={cart?.items}/>
              <button
                onClick={handleContinueShopping}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Continue Shopping
              </button>
              <button
                onClick={handleClearCart}
                className="px-6 py-3 bg-red-400 text-white rounded-lg hover:bg-red-600"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
  </>
)}
     
    </div>
    </Layout>
  );
};

export default CartPage;
