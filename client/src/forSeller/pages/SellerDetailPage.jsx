import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router';
import apiClient from '../../apiClient';

const SellerDetailPage = () => {
    const {id}=useParams();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getSellerData();
  }, [id]);

  const getSellerData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/api/user/seller-info/${id}`);
      setFormData(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error(error.response.data.message);
    }
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      const res = await apiClient.put(`/api/user/update-seller-info/${id}`, formData);
      toast.success('Information updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update information!');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100">
      {/* Edit and Save Buttons */}
      <div className="flex justify-end mb-4">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Save
          </button>
        )}
      </div>

      {/* Seller Contact Details */}
      <section className="mb-8">
        <h2 className="text-xl font-bold">Seller Contact Details</h2>
        <div className="p-4 border rounded-lg">
          <div className="mb-4">
            <label className="block font-medium">Name:</label>
            <input
              type="text"
              className="w-full border px-2 py-1"
              value={formData.sellerDetail?.contact?.name || ''}
              onChange={(e) => handleInputChange('sellerDetail.contact', 'name', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Email:</label>
            <input
              type="email"
              className="w-full border px-2 py-1"
              value={formData.sellerDetail?.contact?.email || ''}
              onChange={(e) => handleInputChange('sellerDetail.contact', 'email', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Phone:</label>
            <input
              type="text"
              className="w-full border px-2 py-1"
              value={formData.sellerDetail?.contact?.phone || ''}
              onChange={(e) => handleInputChange('sellerDetail.contact', 'phone', e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
      </section>

      {/* Bank Account Details */}
      <section className="mb-8">
        <h2 className="text-xl font-bold">Bank Account Details</h2>
        <div className="p-4 border rounded-lg">
          <div className="mb-4">
            <label className="block font-medium">Account Holder:</label>
            <input
              type="text"
              className="w-full border px-2 py-1"
              value={formData.bankAccount?.accountHolder || ''}
              onChange={(e) => handleInputChange('bankAccount', 'accountHolder', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Account Number:</label>
            <input
              type="text"
              className="w-full border px-2 py-1"
              value={formData.bankAccount?.accountNumber || ''}
              onChange={(e) => handleInputChange('bankAccount', 'accountNumber', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Bank Name:</label>
            <input
              type="text"
              className="w-full border px-2 py-1"
              value={formData.bankAccount?.bankName || ''}
              onChange={(e) => handleInputChange('bankAccount', 'bankName', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">IFSC Code:</label>
            <input
              type="text"
              className="w-full border px-2 py-1"
              value={formData.bankAccount?.ifscCode || ''}
              onChange={(e) => handleInputChange('bankAccount', 'ifscCode', e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
      </section>

      {/* Shipping Policies */}
      <section className="mb-8">
        <h2 className="text-xl font-bold">Shipping Policies</h2>
        <div className="p-4 border rounded-lg">
          <div className="mb-4">
            <label className="block font-medium">Handling Time:</label>
            <input
              type="text"
              className="w-full border px-2 py-1"
              value={formData.shippingPolicies?.handlingTime || ''}
              onChange={(e) => handleInputChange('shippingPolicies', 'handlingTime', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Shipping Costs:</label>
            <input
              type="text"
              className="w-full border px-2 py-1"
              value={formData.shippingPolicies?.shippingCosts || ''}
              onChange={(e) => handleInputChange('shippingPolicies', 'shippingCosts', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Delivery Areas:</label>
            <input
              type="text"
              className="w-full border px-2 py-1"
              value={formData.shippingPolicies?.deliveryAreas?.join(', ') || ''}
              onChange={(e) => handleInputChange('shippingPolicies', 'deliveryAreas', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Return Policy:</label>
            <input
              type="text"
              className="w-full border px-2 py-1"
              value={formData.shippingPolicies?.returnPolicy || ''}
              onChange={(e) => handleInputChange('shippingPolicies', 'returnPolicy', e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
      </section>

      {/* Packaging Details */}
      <section className="mb-8">
        <h2 className="text-xl font-bold">Packaging Details</h2>
        <div className="p-4 border rounded-lg">
          <textarea
            className="w-full border px-2 py-1"
            value={formData.packaging || ''}
            onChange={(e) => handleInputChange('', 'packaging', e.target.value)}
            disabled={!isEditing}
          />
        </div>
      </section>

      {/* Notifications */}
      <section className="mb-8">
        <h2 className="text-xl font-bold">Notifications</h2>
        <div className="p-4 border rounded-lg">
          <textarea
            className="w-full border px-2 py-1"
            value={formData.notifications || ''}
            onChange={(e) => handleInputChange('', 'notifications', e.target.value)}
            disabled={!isEditing}
          />
        </div>
      </section>
    </div>
  );
};

export default SellerDetailPage;
