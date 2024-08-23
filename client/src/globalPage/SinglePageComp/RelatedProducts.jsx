import React from 'react';
import Slider from 'react-slick';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';

const RelatedProducts = ({ relatedProducts }) => {
  const navigate = useNavigate();
  const mobileSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
  };

  const desktopSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Related Products</h2>

      {/* Mobile Slider */}
      <div className="block md:hidden">
        <Slider {...mobileSettings}>
          {relatedProducts.map(product => (
            <div
              onClick={()=>navigate(`/product/${product._id}`)}
              key={product._id}
              className="p-1"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </Slider>
      </div>

      {/* Desktop Slider */}
      <div className="hidden md:block">
        <Slider {...desktopSettings}>
          {relatedProducts.map(product => (
               <div
               key={product._id}
               className="p-1"
             >
              <ProductCard product={product}/>
              </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default RelatedProducts;
