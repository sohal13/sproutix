import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import { useNavigate } from 'react-router';
import { userAuth } from '../../../../contextAPI/authContext';

const SellerApplicationForm = () => {
  const {authUser} = userAuth();
    const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setSuccess(null);
    setErrorMessage('');
    try {
      await axios.post(`/api/user/becomeseller/${authUser?._id}`, data);
      setSuccess('Seller application submitted successfully');
      navigate('/user/profile')
    } catch (error) {
      setErrorMessage(error.response.data.message||'Failed to submit seller application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Seller Application</h2>

      {loading && <LoadingSpinner />}

      {success && <div className="text-green-600 mb-4">{success}</div>}
      {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <div>
          <label className="block text-gray-700">Business Name</label>
          <input
            type="text"
            {...register('businessName', { required: 'Business name is required' })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.businessName && <p className="text-red-600">{errors.businessName.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700">Business Type</label>
          <select
            {...register('businessType', { required: 'Business type is required' })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select type</option>
            <option value="sole_proprietorship">Sole Proprietorship</option>
            <option value="partnership">Partnership</option>
            <option value="corporation">Corporation</option>
          </select>
          {errors.businessType && <p className="text-red-600">{errors.businessType.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700">Contact Name</label>
          <input
            type="text"
            {...register('contact.name', { required: 'Contact name is required' })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.contact?.name && <p className="text-red-600">{errors.contact.name.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700">Contact Email</label>
          <input
            type="email"
            {...register('contact.email', { required: 'Contact email is required' })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.contact?.email && <p className="text-red-600">{errors.contact.email.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700">Contact Phone</label>
          <input
            type="text"
            {...register('contact.phone', { required: 'Contact phone is required' })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.contact?.phone && <p className="text-red-600">{errors.contact.phone.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700">Business Address</label>
          <input
            type="text"
            {...register('businessAddress.addressLine1', { required: 'Address line 1 is required' })}
            placeholder="Address Line 1"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.businessAddress?.addressLine1 && <p className="text-red-600">{errors.businessAddress.addressLine1.message}</p>}
          <input
            type="text"
            {...register('businessAddress.addressLine2')}
            placeholder="Address Line 2 (optional)"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            {...register('businessAddress.city', { required: 'City is required' })}
            placeholder="City"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.businessAddress?.city && <p className="text-red-600">{errors.businessAddress.city.message}</p>}
          <input
            type="text"
            {...register('businessAddress.state', { required: 'State is required' })}
            placeholder="State"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.businessAddress?.state && <p className="text-red-600">{errors.businessAddress.state.message}</p>}
          <input
            type="text"
            {...register('businessAddress.postalCode', { required: 'Postal code is required' })}
            placeholder="Postal Code"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.businessAddress?.postalCode && <p className="text-red-600">{errors.businessAddress.postalCode.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700">Website(if any)</label>
          <input
            type="url"
            {...register('website')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700">Business License(if any)</label>
          <input
            type="text"
            {...register('businessLicense')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700">Tax ID(if any)</label>
          <input
            type="text"
            {...register('taxId')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Submiting..":"Submit Application"}
        </button>
      </form>
    </div>
  );
};

export default SellerApplicationForm;
