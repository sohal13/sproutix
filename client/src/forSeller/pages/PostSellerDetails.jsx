import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

const UpdateSellerForm = () => {
    const navigate = useNavigate();
    const params = useParams();
    const sellerId = params.id
    const [formData, setFormData] = useState({
        bankAccount: {
            accountHolder: '',
            accountNumber: '',
            bankName: '',
            ifscCode: ''
        },
        shippingMethods: [{ methodName: '', cost: '', deliveryTime: '' }],
        shippingPolicies: {
            handlingTime: '',
            shippingCosts: '',
            deliveryAreas: [],
            returnPolicy: ''
        },
        packaging: '',
        notifications: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle changes for nested objects
        if (name.includes('.')) {
            const [parent, key] = name.split('.');
            setFormData(prevData => ({
                ...prevData,
                [parent]: {
                    ...prevData[parent],
                    [key]: value
                }
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleArrayChange = (index, e) => {
        const { name, value } = e.target;
        const updatedShippingMethods = [...formData.shippingMethods];
        updatedShippingMethods[index] = {
            ...updatedShippingMethods[index],
            [name]: value
        };
        setFormData(prevData => ({
            ...prevData,
            shippingMethods: updatedShippingMethods
        }));
    };

    const handleAddShippingMethod = () => {
        setFormData(prevData => ({
            ...prevData,
            shippingMethods: [...prevData.shippingMethods, { methodName: '', cost: '', deliveryTime: '' }]
        }));
    };

    const handleRemoveShippingMethod = (index) => {
        const updatedShippingMethods = formData.shippingMethods.filter((_, i) => i !== index);
        setFormData(prevData => ({
            ...prevData,
            shippingMethods: updatedShippingMethods
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.bankAccount.accountHolder) newErrors.accountHolder = 'Account Holder Name is required';
        if (!formData.bankAccount.accountNumber) newErrors.accountNumber = 'Account Number is required';
        if (!formData.bankAccount.bankName) newErrors.bankName = 'Bank Name is required';
        if (!formData.bankAccount.ifscCode) newErrors.ifscCode = 'IFSC Code is required';
        // Add more validation as needed
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        setIsSubmitting(true);
           // Simulate success message
        try {
            const response = await axios.post(`/api/user/additional-info/${sellerId}`, formData);
            setSuccessMessage('Additional information updated successfully!');
            navigate('/user/profile')
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
        
    };

    return (
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Update Seller Additional Information</h1>
            {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Bank Account Details */}
                <div>
                    <h2 className="text-xl font-semibold mb-3">Bank Account Details</h2>
                    <label className="block mb-2">
                        <span className="text-gray-700">Account Holder Name</span>
                        <input
                            type="text"
                            name="bankAccount.accountHolder"
                            placeholder="Enter Account Holder Name"
                            value={formData.bankAccount.accountHolder}
                            onChange={handleChange}
                            className={`w-full p-2 border ${errors.accountHolder ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {errors.accountHolder && <p className="text-red-500">{errors.accountHolder}</p>}
                    </label>
                    <label className="block mb-2">
                        <span className="text-gray-700">Account Number</span>
                        <input
                            type="text"
                            name="bankAccount.accountNumber"
                            placeholder="Enter Account Number"
                            value={formData.bankAccount.accountNumber}
                            onChange={handleChange}
                            className={`w-full p-2 border ${errors.accountNumber ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {errors.accountNumber && <p className="text-red-500">{errors.accountNumber}</p>}
                    </label>
                    <label className="block mb-2">
                        <span className="text-gray-700">Bank Name</span>
                        <input
                            type="text"
                            name="bankAccount.bankName"
                            placeholder="Enter Bank Name"
                            value={formData.bankAccount.bankName}
                            onChange={handleChange}
                            className={`w-full p-2 border ${errors.bankName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {errors.bankName && <p className="text-red-500">{errors.bankName}</p>}
                    </label>
                    <label className="block mb-2">
                        <span className="text-gray-700">IFSC Code(in Upper Case Only)</span>
                        <input
                            type="text"
                            name="bankAccount.ifscCode"
                            placeholder="Enter IFSC Code"
                            value={formData.bankAccount.ifscCode}
                            onChange={handleChange}
                            className={`w-full p-2 border ${errors.ifscCode ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {errors.ifscCode && <p className="text-red-500">{errors.ifscCode}</p>}
                    </label>
                </div>

                {/* Shipping Methods */}
                <div>
                    <h2 className="text-xl font-semibold mb-3">Shipping Methods</h2>
                    {formData.shippingMethods.map((method, index) => (
                        <div key={index} className="mb-4 p-4 border rounded-md">
                            <label className="block mb-2">
                                <span className="text-gray-700">Shipping Method</span>
                                <input
                                    type="text"
                                    name="methodName"
                                    placeholder="Enter Shipping Method"
                                    value={method.methodName}
                                    onChange={(e) => handleArrayChange(index, e)}
                                    className={`w-full p-2 border ${errors.shippingMethodName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                />
                            </label>
                            <label className="block mb-2">
                                <span className="text-gray-700">Cost</span>
                                <input
                                    type="number"
                                    name="cost"
                                    placeholder="Enter Cost"
                                    value={method.cost}
                                    onChange={(e) => handleArrayChange(index, e)}
                                    className={`w-full p-2 border ${errors.cost ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                />
                            </label>
                            <label className="block mb-2">
                                <span className="text-gray-700">Delivery Time</span>
                                <input
                                    type="text"
                                    name="deliveryTime"
                                    placeholder="Enter Delivery Time"
                                    value={method.deliveryTime}
                                    onChange={(e) => handleArrayChange(index, e)}
                                    className={`w-full p-2 border ${errors.deliveryTime ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                />
                            </label>
                            <button
                                type="button"
                                onClick={() => handleRemoveShippingMethod(index)}
                                className="mt-2 text-red-500"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddShippingMethod}
                        className="w-full bg-blue-500 text-white p-2 rounded-md"
                    >
                        Add Shipping Method
                    </button>
                </div>

                {/* Shipping Policies */}
                <div>
                    <h2 className="text-xl font-semibold mb-3">Shipping Policies</h2>
                    <label className="block mb-2">
                        <span className="text-gray-700">Handling Time</span>
                        <input
                            type="text"
                            name="shippingPolicies.handlingTime"
                            placeholder="Enter Handling Time"
                            value={formData.shippingPolicies.handlingTime}
                            onChange={handleChange}
                            className={`w-full p-2 border ${errors.handlingTime ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                    </label>
                    <label className="block mb-2">
                        <span className="text-gray-700">Shipping Costs</span>
                        <input
                            type="text"
                            name="shippingPolicies.shippingCosts"
                            placeholder="Enter Shipping Costs"
                            value={formData.shippingPolicies.shippingCosts}
                            onChange={handleChange}
                            className={`w-full p-2 border ${errors.shippingCosts ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                    </label>
                    <label className="block mb-2">
                        <span className="text-gray-700">Delivery Areas</span>
                        <input
                            type="text"
                            name="shippingPolicies.deliveryAreas"
                            placeholder="Enter Delivery Areas"
                            value={formData.shippingPolicies.deliveryAreas.join(', ')}
                            onChange={(e) => handleChange({ target: { name: 'shippingPolicies.deliveryAreas', value: e.target.value.split(', ') } })}
                            className={`w-full p-2 border ${errors.deliveryAreas ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                    </label>
                    <label className="block mb-2">
                        <span className="text-gray-700">Return Policy</span>
                        <textarea
                            name="shippingPolicies.returnPolicy"
                            placeholder="Enter Return Policy"
                            value={formData.shippingPolicies.returnPolicy}
                            onChange={handleChange}
                            className={`w-full p-2 border ${errors.returnPolicy ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                    </label>
                </div>

                {/* Packaging */}
                <div>
                    <label className="block mb-2">
                        <span className="text-gray-700">Packaging Details</span>
                        <textarea
                            name="packaging"
                            placeholder="Enter Packaging Details"
                            value={formData.packaging}
                            onChange={handleChange}
                            className={`w-full p-2 border ${errors.packaging ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                    </label>
                </div>

                {/* Notifications */}
                <div>
                    <label className="block mb-2">
                        <span className="text-gray-700">Notifications</span>
                        <textarea
                            name="notifications"
                            placeholder="Enter Notifications"
                            value={formData.notifications}
                            onChange={handleChange}
                            className={`w-full p-2 border ${errors.notifications ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                    </label>
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white p-2 rounded-md"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateSellerForm;
