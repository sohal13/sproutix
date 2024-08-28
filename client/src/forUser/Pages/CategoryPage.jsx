// src/components/CategoryPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from './Components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import apiClient from '../../apiClient';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/api/categories/all');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="loader"><LoadingSpinner/></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Categories</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <div
              key={category.category}
              className="border rounded-lg overflow-hidden shadow-md transform transition-transform duration-300 hover:scale-105 cursor-pointer bg-green-100"
              onClick={() => navigate(`/categories/${category.category}`)}
            >
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.category}
                  className="w-full h-48 object-cover transition-opacity duration-300 ease-in-out hover:opacity-80"
                />
              ) : (
                <div className="h-48 bg-gray-300 flex items-center justify-center">
                  <span>No Image Available</span>
                </div>
              )}
              <div className="p-4 text-center">
                <h2 className="text-lg font-semibold">{category.category}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
