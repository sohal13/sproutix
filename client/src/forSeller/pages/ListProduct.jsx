import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebaseConfig';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SellerListingForm = () => {
  // Form state variables
  const API_BASE_URL= import.meta.env.VITE_API_BASE_URL;
  const categories = [
    'Fruit Plants',
    'Vegetable Plants',
    'Herbs',
    'Flowering Plants',
    'Indoor Plants',
    'Outdoor Plants',
    'Specialty Plants',
    'Garden Accessories'
];

// Predefined options
const soilTypes = [
  'Loamy',
  'Sandy',
  'Clay',
  'Peaty',
  'Saline',
  'Chalky',
  'Silty'
];

const climates = [
  'Tropical',
  'Subtropical',
  'Temperate',
  'Arid',
  'Cold',
  'Mediterranean',
  'Continental',
  'Subarctic',
  'Polar',
  'Desert',
  'Mountain'
];

const lightRequirements = [
  'Full Sun',
  'Partial Shade',
  'Full Shade',
  'Low Light',
  'Bright Indirect Light'
];

const waterRequirements = [
  'Low',
  'Moderate',
  'High'
];
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    brand: '',
    careInstructions: '',
    lightRequirement: '',
    waterRequirement: '',
    soilType: '',
    climate: '',
  });

  // File upload states
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreview, setVideoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle file input changes
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  // Remove specific image preview and file
  const handleImageRemove = (index) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  // Remove video preview and file
  const handleVideoRemove = () => {
    setVideoFile(null);
    setVideoPreview('');
  };

  // Handle file uploads
  const handleImageUpload = async () => {
    const imageUrls = [];
    for (const file of imageFiles) {
      const imageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      imageUrls.push(url);
    }
    return imageUrls;
  };

  const handleVideoUpload = async () => {
    if (!videoFile) return '';
    const videoRef = ref(storage, `videos/${videoFile.name}`);
    await uploadBytes(videoRef, videoFile);
    const url = await getDownloadURL(videoRef);
    return url;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const imageUrls = await handleImageUpload();
      const videoUrl = await handleVideoUpload();

      const productData = {
        ...formData,
        images: imageUrls,
        video: videoUrl
      };

      const response = await fetch(`${API_BASE_URL}/api/product/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
        credentials: 'include' 
      });

      if (response.ok) {
        toast.success('Product listed successfully!');
        navigate('/seller/manageproduct'); // Redirect to products page
      } else {
        throw new Error('Failed to list product');
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-green-800 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-100 mb-6">List Your Plant</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {Object.entries({
    name: 'Plant Name',
    scientificName: 'Scientific Name',
    description: 'Description',
    price: 'Price ($)',
    quantity: 'Quantity',
    brand: 'Brand',
    careInstructions: 'Care Instructions',
  }).map(([key, label]) => (
    <div key={key}>
      <label htmlFor={key} className="block text-sm font-medium text-gray-700">{label}</label>
      {key === 'description' || key === 'careInstructions' ? (
        <textarea
          id={key}
          name={key}
          value={formData[key]}
          onChange={handleChange}
          rows="4"
          required={key === 'description'}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
        />
      ) : (
        <input
          type={key === 'price' ? 'number' : 'text'}
          id={key}
          name={key}
          value={formData[key]}
          onChange={handleChange}
          required={key === 'price' || key === 'quantity'}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
        />
      )}
    </div>
  ))}
  <div>
    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
    <select
      id="category"
      name="category"
      value={formData.category}
      onChange={handleChange}
      required
      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
    >
      <option value="">Select a category</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
    </select>
  </div>
  <div>
    <label htmlFor="soilType" className="block text-sm font-medium text-gray-700">Soil Type</label>
    <select
      id="soilType"
      name="soilType"
      value={formData.soilType}
      onChange={handleChange}
      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
    >
      <option value="">Select soil type</option>
      {soilTypes.map((soil) => (
        <option key={soil} value={soil}>{soil}</option>
      ))}
    </select>
  </div>
  <div>
    <label htmlFor="climate" className="block text-sm font-medium text-gray-700">Climate</label>
    <select
      id="climate"
      name="climate"
      value={formData.climate}
      onChange={handleChange}
      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
    >
      <option value="">Select climate</option>
      {climates.map((climate) => (
        <option key={climate} value={climate}>{climate}</option>
      ))}
    </select>
  </div>
  <div>
    <label htmlFor="lightRequirement" className="block text-sm font-medium text-gray-700">Light Requirement</label>
    <select
      id="lightRequirement"
      name="lightRequirement"
      value={formData.lightRequirement}
      onChange={handleChange}
      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
    >
      <option value="">Select climate</option>
      {lightRequirements.map((lightRequirement) => (
        <option key={lightRequirement} value={lightRequirement}>{lightRequirement}</option>
      ))}
    </select>
  </div>
  <div>
    <label htmlFor="waterRequirement" className="block text-sm font-medium text-gray-700">Water Requirement</label>
    <select
      id="waterRequirement"
      name="waterRequirement"
      value={formData.waterRequirement}
      onChange={handleChange}
      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
    >
      <option value="">Select climate</option>
      {waterRequirements.map((waterRequirement) => (
        <option key={waterRequirement} value={waterRequirement}>{waterRequirement}</option>
      ))}
    </select>
  </div>
  <div>
    <label htmlFor="image" className="block text-sm font-medium text-gray-700">Images (Up to 4)</label>
    <input
      type="file"
      id="image"
      name="image"
      multiple
      accept="image/*"
      onChange={handleImageChange}
      className="mt-1 block w-full"
    />
    <div className="mt-2">
      {imagePreviews.map((preview, index) => (
        <div key={index} className="relative inline-block">
          <img src={preview} alt={`Preview ${index + 1}`} className="w-24 h-24 object-cover mt-2" />
          <button
            type="button"
            onClick={() => handleImageRemove(index)}
            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  </div>
  <div>
    <label htmlFor="video" className="block text-sm font-medium text-gray-700">Video</label>
    <input
      type="file"
      id="video"
      name="video"
      accept="video/*"
      onChange={handleVideoChange}
      className="mt-1 block w-full"
    />
    {videoPreview && (
      <div className="relative">
        <video controls className="w-full mt-2">
          <source src={videoPreview} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <button
          type="button"
          onClick={handleVideoRemove}
          className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
        >
          ×
        </button>
      </div>
    )}
  </div>
</div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 ${loading ? 'bg-gray-400' : 'bg-green-600'} text-white font-bold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50`}
          >
            {loading ? 'Listing...' : 'List Plant'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerListingForm;
