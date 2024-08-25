import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import { userAuth } from '../../../../contextAPI/authContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const CheckoutPageButton = ({product}) => {
  const {authUser}  = userAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  console.log(product);
  const handleCheckout = async () => {
    if(!authUser) return navigate(`/login`)
    setLoading(true);
    try {
      const items = product.map(item => ({
        _id: item.productId ? item.productId : item._id,
        name: item.name,
        sellerId:item.userId,
        image: item.image[0],
        price: item.price, 
        quantity:item.productId ? item.quantity : 1, 
      }));
      console.log(items);
      // Request to create a checkout session
      const response = await axios.post('/api/payment/create-checkout-session', {
        items: items,
        user: authUser,// Adjust as needed
      });
      // Redirect to Stripe Checkout
      const { url } = response.data;
      window.location.href = url;
      try {
        const trackUser = await axios.post('/api/user/track-activity', {
          productId:id,
          action:'purchase',
      });
       } catch (error) {
        console.error(error?.response?.data?.message);
       }
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };
  return (
    <>
      {loading ? (
        <>Loading...</>// Custom Loader component
      ) : (
          <button
            onClick={handleCheckout}
            className="bg-green-500 text-white h-auto px-2 py-2 rounded-lg w-full"
          >
            Buy Now
          </button>
      )}
    </>
  );
};

export default CheckoutPageButton;
