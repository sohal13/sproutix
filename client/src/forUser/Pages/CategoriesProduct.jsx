import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './Components/Layout/Layout';
import ProductCard from '../../components/ProductCard';
import apiClient from '../../apiClient';

const ProductPage = () => {
    const prams = useParams();
    const categoriename = prams.id
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await apiClient.get(`/api/categories/get/${categoriename}`);
                setProducts(response.data);
            } catch (err) {
                setError('Error fetching products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoriename]);

    if (loading) {
        return <div className="text-center py-10">Loading products...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-600">{error}</div>;
    }

    return (
        <Layout>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6 text-center">Products in {categoriename}</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {products.map((product) => (
                        <ProductCard product={product}/>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default ProductPage;
