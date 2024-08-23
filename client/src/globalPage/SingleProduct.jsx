import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductImageGallery from './SinglePageComp/ProductImageGallery';
import ProductInfo from './SinglePageComp/ProductInfo';
import ProductReviews from './SinglePageComp/ProductReviews';
import apiClient from '../apiClient';
import Layout from '../forUser/Pages/Components/Layout/Layout';
import RelatedProducts from './SinglePageComp/RelatedProducts';
import { toast } from 'react-toastify';

const SingleProduct = () => {
  const { id } = useParams();
  const [currentid , setcurrentid] = useState(id)
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     if(currentid !== id){
      setLoading(true)
      fetchProduct()
    }else{
      fetchProduct();
    }
  }, [id]);
  const fetchProduct = async () => {
    try {
      const response = await apiClient.get(`/api/product/this/${id}`);
      setProduct(response.data);
       // Fetch related products
       const relatedResponse = await apiClient.get(`/api/product/related/${id}`);
       setRelatedProducts(relatedResponse.data || [])
       //monetring user
       try {
        const trackUser = await apiClient.post('/api/user/track-activity', {
          productId:id,
          action:'view',
      });
       } catch (error) {
        console.error(error.response.data.message);
       }
    } catch (error) {
      toast.error('Error fetching product:', error.response.data.message);
    }
    setLoading(false);
  };

  return (
    <Layout>
      {loading ? (<LoadingSpinner/>):(
 <div className="container mx-auto p-4">
 <div className="flex flex-col md:flex-row">
   <ProductImageGallery images={product?.image} videoUrl={product?.videoUrl} productId={product?._id} product={product}/>
   <div className="md:ml-8 mt-8 md:mt-0">
     <ProductInfo product={product} />
   </div>
 </div>
 <ProductReviews reviews={product?.reviews} />
</div>
      )}
      <div className='container mx-auto p-1'>
      <RelatedProducts relatedProducts={relatedProducts} />
      </div>
    </Layout>
  );
};

export default SingleProduct;
