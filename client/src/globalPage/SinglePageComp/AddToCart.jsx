import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import apiClient from '../../apiClient';
import { useNavigate } from 'react-router';
import CheckoutPageButton from '../../forUser/Pages/Components/CheckOutComponents/CheckOutPageButton';
import { userAuth } from '../../contextAPI/authContext';

const AddToCart = ({ productId ,product}) => {
  const {authUser} = userAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if(!authUser) return navigate(`/login`)
    setLoading(true);
    try {
      const response = await apiClient.post('/api/cart/add', { productId , quantity:1 });
      toast.success('Product added to cart!');
      try {
        const trackUser = await apiClient.post('/api/user/track-activity', {
          productId:productId,
          action:'click',
      });
       } catch (error) {
        console.error(error?.response?.data?.message);
       }
    } catch (error) {
      toast.error('Failed to add product to cart');
    }
    setLoading(false);
  };

  return (
    <div className='flex justify-around'>
        <button
      onClick={handleAddToCart}
      className="bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg mt-4"
      disabled={loading}
    >
      {loading ? 'Adding...' : 'Add to Cart'}
    </button>
    <div className="text-white font-bold  rounded-lg mt-5">
    <CheckoutPageButton product={[product]} className="h-auto"/>
    </div>
    </div>

  );
};

export default AddToCart;
