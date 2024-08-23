import React, { useState } from 'react';
import { FaTag, FaStar, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const PromotionalTools = ({ product, onDiscountApply, onToggleFeatured }) => {
    const [discount, setDiscount] = useState('');
    const [isFeatured, setIsFeatured] = useState(product.isFeatured);

    const handleDiscountApply = () => {
        if (discount) {
            onDiscountApply(product.id, discount);
            toast.success(`Discount of ${discount}% applied to ${product.name}!`);
            setDiscount('');
        } else {
            toast.error('Please enter a valid discount.');
        }
    };

    const handleToggleFeatured = () => {
        const newFeaturedStatus = !isFeatured;
        onToggleFeatured(product.id, newFeaturedStatus);
        setIsFeatured(newFeaturedStatus);
        toast.success(`${product.name} is now ${newFeaturedStatus ? 'featured' : 'not featured'}.`);
    };

    return (
        <div className="p-4 border rounded-md bg-gray-50 flex justify-between items-center space-x-4">
            <div>
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-sm">Current Price: <span className="font-bold text-green-600">${product.price}</span></p>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center">
                    <FaTag className="text-blue-600 mr-2" />
                    <input
                        type="number"
                        className="border border-gray-300 rounded-md p-1 w-20 text-center focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Discount %"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                    />
                    <button
                        onClick={handleDiscountApply}
                        className="bg-blue-600 text-white px-4 py-2 rounded ml-2 hover:bg-blue-700 transition duration-200"
                    >
                        Apply
                    </button>
                </div>
                <button
                    onClick={handleToggleFeatured}
                    className={`flex items-center px-4 py-2 rounded ${isFeatured ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-yellow-600 hover:text-white transition duration-200`}
                >
                    <FaStar className="mr-2" />
                    {isFeatured ? 'Unfeature' : 'Feature'}
                </button>
            </div>
        </div>
    );
};

export default PromotionalTools;
