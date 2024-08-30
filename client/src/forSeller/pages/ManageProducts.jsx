import React, { useState, useEffect } from 'react';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash, FaEye, FaPlus, FaSearch, FaFilter } from 'react-icons/fa';

import { Link } from 'react-router-dom';
import apiClient from '../../apiClient';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        stockStatus: '',
        priceRange: [0, 1000],
    });

    useEffect(() => {
        apiClient.get('/api/product/mylisting')
            .then((response) => {
                setProducts(response.data);
                setFilteredProducts(response.data);
                setLoading(false);
            })
            .catch((error) => {
                toast.error(error.response.data.message);
                setLoading(false);
            });
    }, []);

    //filter option
    useEffect(() => {
        handleFilterAndSort();
    }, [searchTerm, sortOption, filters]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const handleFilterAndSort = () => {
        let filtered = products.filter((product) => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filters.category === '' || product.category === filters.category) &&
            (filters.stockStatus === '' || (filters.stockStatus === 'In Stock' ? product.stock > 0 : product.stock === 0)) &&
            product.price >= filters.priceRange[0] &&
            product.price <= filters.priceRange[1]
        );

        if (sortOption === 'name') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === 'price') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'stock') {
            filtered.sort((a, b) => b.stock - a.stock);
        }

        setFilteredProducts(filtered);
    };

    //handel promotions
    /*const promotion = [
        { id: 1, name: 'Aloe Vera', price: 15, isFeatured: false },
        { id: 2, name: 'Cactus', price: 25, isFeatured: true },
    ];

    const handleDiscountApply = (productId, discount) => {
        // Logic to apply discount
        console.log(`Applied ${discount}% discount to product ID: ${productId}`);
    };

    const handleToggleFeatured = (productId, isFeatured) => {
        // Logic to toggle featured status
        console.log(`Product ID: ${productId} is now ${isFeatured ? 'featured' : 'not featured'}`);
    };*/
    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Manage Products</h2>

            <div className="space-y-4 lg:flex lg:justify-between lg:space-y-0 lg:space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                    <FaSearch className="text-green-800" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="px-4 py-2 border border-green-600 rounded w-full lg:w-auto"
                    />
                </div>

                <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 items-center">
                    <div className="flex items-center space-x-2">
                        <FaFilter className="text-green-800" />
                        <select 
                            name="category" 
                            value={filters.category} 
                            onChange={handleFilterChange} 
                            className="px-4 py-2 border border-green-600 rounded w-full sm:w-auto"
                        >
                            <option value="">All Categories</option>
                            <option value="Fruit">Fruit</option>
                            <option value="Vegetable">Vegetable</option>
                            <option value="Flower">Flower</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <select 
                            name="stockStatus" 
                            value={filters.stockStatus} 
                            onChange={handleFilterChange} 
                            className="px-4 py-2 border border-green-600 rounded w-full sm:w-auto"
                        >
                            <option value="">All Stock Status</option>
                            <option value="In Stock">In Stock</option>
                            <option value="Out of Stock">Out of Stock</option>
                        </select>

                        <select 
                            name="sortOption" 
                            value={sortOption} 
                            onChange={handleSortChange} 
                            className="px-4 py-2 border border-green-600 rounded w-full sm:w-auto"
                        >
                            <option value="">Sort By</option>
                            <option value="name">Name</option>
                            <option value="price">Price</option>
                            <option value="stock">Stock Level</option>
                        </select>
                    </div>
                </div>
    
                <Link to={'/seller/list'} className="bg-green-600 text-white px-4 py-2 rounded flex items-center w-full sm:w-auto justify-center">
                    <FaPlus className="mr-2" /> Add New Product
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-green-600 h-12 w-12"></div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b-2 border-green-600 text-left">Image</th>
                                <th className="py-2 px-4 border-b-2 border-green-600 text-left">Product Name</th>
                                <th className="py-2 px-4 border-b-2 border-green-600 text-left">Category</th>
                                <th className="py-2 px-4 border-b-2 border-green-600 text-left">Price</th>
                                <th className="py-2 px-4 border-b-2 border-green-600 text-left">Stock</th>
                                <th className="py-2 px-4 border-b-2 border-green-600 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts?.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b"><img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" /></td>
                                    <td className="py-2 px-4 border-b">{product.name}</td>
                                    <td className="py-2 px-4 border-b">{product.category}</td>
                                    <td className="py-2 px-4 border-b">₹{product.price}</td>
                                    <td className="py-2 px-4 border-b">{product.quantity}</td>
                                    <td className="py-2 px-4 border-b flex space-x-2 mt-10 text-2xl">
                                        <button onClick={() => handleEdit(product.id)} className="text-blue-600 hover:text-blue-800"><FaEdit /></button>
                                        <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
                                        <Link to={`/product/${product._id}`}  className="text-green-600 hover:text-green-800"><FaEye /></Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageProducts;
