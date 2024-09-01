import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductImageGallery from './SinglePageComp/ProductImageGallery';
import ProductInfo from './SinglePageComp/ProductInfo';
import ProductReviews from './SinglePageComp/ProductReviews';
import Layout from '../forUser/Pages/Components/Layout/Layout';
import RelatedProducts from './SinglePageComp/RelatedProducts';
import { toast } from 'react-toastify';
import apiClient from '../apiClient';
import axios from 'axios'
const SingleProduct = () => {
  const { id } = useParams();
  const [currentid, setcurrentid] = useState(id);
  const [product, setProduct] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [sellerData, setSellerData] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentid !== id) {
      setLoading(true);
      fetchProduct();
      window.scrollTo(0, 0); // Scroll to the top of the page
    } else {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      
      // Fetch main product details
      const productResponse = await apiClient.get(`/api/product/this/${id}`);
      setProduct(productResponse.data);

      // Fetch seller details
      const sellerResponse = await axios.get(`/api/product/expected-delivery/${id}`);
      setSellerData(sellerResponse.data);

      // Fetch related products
      const relatedResponse = await apiClient.get(`/api/product/related/${id}`);
      setRelatedProducts(relatedResponse.data || []);

      // After fetching important data, calculate delivery date
      const userLocation = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)user_location\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
      const distanceAndTime = await getDistanceAndTime(userLocation, sellerResponse.data.coordinates);
      
      // Calculate delivery date
      const deliveryDate = calculateDeliveryDate(sellerResponse.data.shippingPolicies, distanceAndTime.duration);
      setDeliveryDate(deliveryDate);
      console.log("Estimated Delivery Date:", deliveryDate);

      // Track user activity
      await apiClient.post('/api/user/track-activity', {
        productId: id,
        action: 'view',
      });

    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to calculate the distance and time using OpenRouteService (or similar API)
  const getDistanceAndTime = async (userCoords, sellerCoords) => {
    const apiKey = '5b3ce3597851110001cf6248d70ef779c86f44f6861f914f04cf3cb6'; // Replace with your OpenRouteService API key
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${userCoords.longitude},${userCoords.latitude}&end=${sellerCoords.longitude},${sellerCoords.latitude}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const segment = data.features[0].properties.segments[0];
      const duration = (segment.duration / 3600).toFixed(2); // Convert seconds to hours

      return {
        duration,
      };
    } catch (error) {
      console.error("Error fetching distance and time:", error);
      return { duration: null };
    }
  };

  // Function to calculate the delivery date
  const calculateDeliveryDate = (shippingPolicies, travelDuration) => {
    if (!shippingPolicies) {
      console.error('Shipping policies are undefined:', shippingPolicies);
      return;
    }

    const handlingTimeStr = shippingPolicies.handlingTime;
    if (!handlingTimeStr) {
      console.error('Handling time is undefined:', { handlingTimeStr });
      return;
    }

    const handlingTime = parseInt(handlingTimeStr.split('-')[1], 10);
    const totalDeliveryTime = handlingTime + Math.ceil(travelDuration);
    const deliveryDate = new Date();
    let daysToAdd = totalDeliveryTime;

    while (daysToAdd > 0) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
      const dayOfWeek = deliveryDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip weekends
        daysToAdd--;
      }
    }
    return deliveryDate.toDateString();
  };
  return (
    <Layout>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="container mx-auto p-4">
          <div className="flex flex-col md:flex-row">
            <ProductImageGallery images={product?.image} videoUrl={product?.videoUrl} productId={product?._id} product={product} />
            <div className="md:ml-8 mt-8 md:mt-0">
              <ProductInfo product={product} deliveryDate={deliveryDate}/>
            </div>
          </div>
          <ProductReviews reviews={product?.reviews} />
        </div>
      )}
      <div className="container mx-auto p-1">
        <RelatedProducts relatedProducts={relatedProducts} />
      </div>
    </Layout>
  );
};

export default SingleProduct;
