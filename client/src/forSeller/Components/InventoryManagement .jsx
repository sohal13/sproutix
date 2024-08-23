import React from 'react';
import { FaExclamationTriangle, FaBoxOpen } from 'react-icons/fa';

const InventoryManagement = ({ product, onRestock }) => {
    // Define the threshold for low stock
    const lowStockThreshold = 10;

    return (
        <div className={`p-4 border rounded-md ${product.stock <= lowStockThreshold ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'} flex justify-between items-center`}>
            <div className="flex items-center">
                {product.stock <= lowStockThreshold && (
                    <FaExclamationTriangle className="text-red-500 mr-2" />
                )}
                <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm">Stock: <span className={`font-bold ${product.stock <= lowStockThreshold ? 'text-red-500' : 'text-green-600'}`}>{product.stock}</span></p>
                </div>
            </div>
            {product.stock <= lowStockThreshold && (
                <button 
                    onClick={() => onRestock(product.id)} 
                    className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700 transition duration-200"
                >
                    <FaBoxOpen className="mr-2" /> Restock
                </button>
            )}
        </div>
    );
};

export default InventoryManagement;
