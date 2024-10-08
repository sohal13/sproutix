// src/pages/Login.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router';
import { userAuth } from '../contextAPI/authContext';
import { Link } from 'react-router-dom'
import apiClient from '../apiClient';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setauthUser } = userAuth();

  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post(`/api/auth/login`, formData);
      const { token, user } = response.data;
      localStorage.setItem('plantebuy_user', JSON.stringify(user));
      // Save token in cookies
      const date = new Date(Date.now() + 258920000000); // 730 days for 2 years
      const expires = "expires=" + date.toUTCString();
      document.cookie = `plantebuy_token=${token}; path=/; ${expires}`;


    // Geolocation Request
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          
          // Store location in cookies for later use
          document.cookie = `user_location=${JSON.stringify({ latitude, longitude })}; path=/; ${expires}`;
          
          // Redirect based on user type
          if (user.isSeller === false) {
            const from = location.state?.from || '/';
            navigate(from);
          } else {
            navigate('/seller');
          }
        },
        (error) => {
          console.error('Error fetching location:', error);
          // Redirect even if location fetching fails
          if (user.isSeller === false) {
            const from = location.state?.from || '/';
            navigate(from);
          } else {
            navigate('/seller');
          }
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
      setauthUser(user)
      toast.success('Login successful!');
      if (user.isSeller === false) {
        const from = location.state?.from || '/';
        navigate(from);
        
      }
      navigate('/seller')
    } catch (error) {
      toast.error(error.response.data.message || 'Login failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-800 p-2">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">SproutiX Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="phone">Phone</label>
            <input
              type="number"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div className='text-sm'>don't have an account ? <Link to={'/register'}><span className='underline text-blue-500'>Register</span></Link></div>
        </form>
      </div>
    </div>
  );
};

export default Login;
