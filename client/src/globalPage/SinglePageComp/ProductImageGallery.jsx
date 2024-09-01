import React, { useState, useMemo } from 'react';
import Slider from 'react-slick';
import AddToCart from './AddToCart';
import videoThumbnai from '../../../public/thumbnail.webp'

// Memoize Slider settings to avoid re-calculation on every render
const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplaySpeed: 3000,
  cssEase: 'linear',
  adaptiveHeight: true,
};

const ProductImageGallery = ({ images, videoUrl, productId, product }) => {
  const [selectedMedia, setSelectedMedia] = useState(images[0]);
  const isVideo = selectedMedia === videoUrl;

  // Memoized component to avoid unnecessary re-renders
  const renderMedia = useMemo(() => {
    if (isVideo) {
      return (
        <video
          src={selectedMedia}
          controls
          autoPlay
          className="w-full h-full object-cover rounded-lg"
          loading="lazy"
          // Include placeholder or poster for better loading experience
          poster="/path-to-placeholder-image.jpg"
        >
          Your browser does not support the video tag.
        </video>
      );
    }
    return (
      <img
        src={selectedMedia}
        alt="Selected"
        className="w-full h-full object-cover rounded-lg"
        loading="lazy"
      />
    );
  }, [selectedMedia, isVideo]);

  return (
    <div className="w-full md:w-1/2 relative">
      <div className="hidden md:block w-full h-auto">
        <div className="flex items-center justify-center h-80 relative">
          {renderMedia}
          <div className='w-full absolute bottom-1'>
      <AddToCart productId={productId} product={product} />
      </div>
        </div>
        <div className="flex flex-wrap mt-4 space-x-4 md:space-x-0 md:grid md:grid-cols-4 md:gap-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="w-1/4 md:w-full cursor-pointer"
              onClick={() => setSelectedMedia(img)}
            >
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-20 object-cover rounded-lg"
                loading="lazy"
                // Use a low-quality image placeholder (LQIP) for better performance
                // Placeholder can be generated or pre-defined
              />
            </div>
          ))}
          {videoUrl && (
            <div className="w-1/4 md:w-full cursor-pointer">
              <video
                src={videoUrl} // Placeholder for video thumbnail
                alt="Video Thumbnail"
                className="w-full h-20 object-cover rounded-lg"
                onClick={() => setSelectedMedia(videoUrl)}
                loading="lazy"
                // Include a thumbnail for the video
                poster={videoThumbnai}
              />
            </div>
          )}
        </div>
      </div>

      {/* Slider for Mobile Screens */}
      <div className="md:hidden">
        <Slider {...sliderSettings}>
          {images.map((img, index) => (
            <div key={index} onClick={() => setSelectedMedia(img)}>
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                className="w-full h-80 object-cover rounded-lg"
                loading="lazy"
              />
            </div>
          ))}
          {videoUrl && (
            <div onClick={() => setSelectedMedia(videoUrl)}>
              <video
                src={videoUrl}
                controls
                className="w-full h-80 object-cover rounded-lg"
                loading="lazy"
                poster={videoThumbnai}
              />
            </div>
          )}
        </Slider>
        <div className='w-full absolute bottom-[-40px]'>
      <AddToCart productId={productId} product={product} />
      </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;
