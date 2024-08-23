// src/components/FeaturedPlants.js
import React, { useEffect, useState } from 'react';
import { featuredPlants } from '../../../dumy/Data';
import { async } from '@firebase/util';
import apiClient from '../../../../apiClient';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import ProductCard from '../../../../components/ProductCard';
import { userAuth } from '../../../../contextAPI/authContext';

const FeaturedPlants = () => {
  const {authUser} = userAuth();
  const [featured , setfeatured] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    getfeaturedfeatured();
  },[])

  const getfeaturedfeatured=async()=>{
    setLoading(true)
    try {
      const {data} = await apiClient.get(`/api/product/featured?userId=${authUser?._id}`);
      if(data.success !== true){
        setLoading(false);
        toast.error(data.message)
      }
      setLoading(false)
      setfeatured(data)
      console.log(featured);
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message)
      console.log(error);
    }
  }
  return (
    <section className="p-8 bg-white shadow-md">
      <h2 className="text-2xl font-bold mb-4">Featured Plants</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {loading ? (<LoadingSpinner/>):(
          <>
          {featured?.map((product)=>(
            <ProductCard key={product._id} product={product}/>
          ))}
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedPlants;
