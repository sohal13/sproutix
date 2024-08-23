import React, { useState } from 'react';
import Slider from 'react-slick';
import AddToCart from './AddToCart';

const ProductImageGallery = ({ images, videoUrl, productId, product }) => {
  const [selectedMedia, setSelectedMedia] = useState(images[1]);
  const isVideo = selectedMedia === videoUrl;
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 3000,
  };

  return (
    <div className="w-full md:w-1/2">
      <div className="hidden md:block">
        <div className="flex items-center justify-center h-80">
          {isVideo ? (
            <video
              src={selectedMedia}
              controls
              autoPlay
              className="w-full h-full object-cover rounded-lg shadow-lg"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={selectedMedia}
              alt="Selected"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          )}
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
              />
            </div>
          )}
        </div>
      </div>

      {/* Slider for Mobile Screens */}
      <div className="md:hidden">
        <Slider {...settings}>
          {images.map((img, index) => (
            <div key={index} onClick={() => setSelectedMedia(img)}>
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                className="w-full h-80 object-cover rounded-lg shadow-lg"
              />
            </div>
          ))}
          {videoUrl && (
            <div onClick={() => setSelectedMedia(videoUrl)}>
              <video
                src={videoUrl}
                controls
                className="w-full h-80 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}
        </Slider>
      </div>
      <div>
      </div>
      <AddToCart productId={productId} product={product} />
    </div>
  );
};

export default ProductImageGallery;
