// src/components/Navbar.jsx
import React, { useEffect, useState } from 'react';
import { FaBars,FaShoppingCart, FaHome, FaTags, FaSearch, FaTimes, FaShopify, FaEnvelope } from 'react-icons/fa';
import { userAuth } from '../../../../contextAPI/authContext';
import { useLocation, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import axios from 'axios';
import apiClient from '../../../../apiClient';

const Navbar = () => {
  const { authUser } = userAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const isLoggedIn = authUser ? true : false; // Change this value based on your authentication logic

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  //search handler

  const handleSearch = (e) => {
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Fetch suggestions
  const fetchSuggestions = async (query) => {
    if (query) {
      try {
        const response = await apiClient.get(`/api/product/search-suggestions?query=${query}`);
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]); // Clear suggestions if the query is empty
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions(searchTerm); // Fetch suggestions when searchTerm changes
    }, 300); // Delay of 300ms

    return () => clearTimeout(delayDebounceFn); // Cleanup
  }, [searchTerm]);

  const hadelSetSuggestion=(id) => {
    setSuggestions([])
    navigate(`/product/${id}`)
  }
  return (
    <header className="bg-green-700 text-white">
      <nav className="container mx-auto p-4 flex justify-between items-center">
        {/* Logo */}
        <Link to={'/'} className="text-2xl font-bold">
          SproutiX
        </Link>

        {/* Search Bar for Large Screens */}
        <div className="hidden md:flex flex-1 mx-8 items-center bg-white rounded-full relative">
          <input
            type="text"
            placeholder="Search for plants..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 px-4 text-green-900 outline-none bg-transparent"
          />
          <FaSearch onClick={handleSearch} className="mr-2 text-green-800 cursor-pointer" />

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute z-10 bg-green-100 rounded-md shadow-lg w-full top-10 text-black">
              <ul>
                {suggestions.map((suggestion) => (
                  <li key={suggestion._id} className="px-4 py-2 hover:bg-gray-200 cursor-pointer shadow-sm" onClick={()=>hadelSetSuggestion(suggestion._id)}>
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Links for large screens */}
        <ul className="hidden md:flex space-x-2 items-center">
          <li className="bg-white text-green-600 px-4 py-2 rounded-full hover:bg-gray-200 cursor-pointer flex items-center">
            <FaHome className="mr-2" />
            <Link to="/">Home</Link>
          </li>
          <li className="bg-white text-green-600 px-4 py-2 rounded-full hover:bg-gray-200 cursor-pointer flex items-center">
            <FaTags className="mr-2" />
            <Link to="/categories">Category</Link>
          </li>

          <li className="bg-white text-green-600 px-4 py-2 rounded-full hover:bg-gray-200 cursor-pointer flex items-center">
            <FaShoppingCart className="mr-2" />
            <Link to="/user/cart">Cart</Link>
          </li>
        </ul>

        {/* Login/Profile Button */}
        <div className="hidden md:flex items-center">
          {isLoggedIn ? (
            <Link to={'/user/profile'} className="flex items-center cursor-pointer bg-white rounded-full px-1 ml-2">
              <img
                src={authUser?.photo}
                alt="User"
                className="w-10 h-10 rounded-full"
              />
              <span className="text-green-800">Profile</span>
            </Link>
          ) : (
            <div className='ml-2 animate-bounce'>
              <li className="bg-green-900 text-yellow-500 px-4 py-2 rounded-full hover:bg-green-800 cursor-pointer flex items-center">
                <Link to="/login">Login</Link>
              </li>
            </div>

          )}
        </div>

        {/* Hamburger icon for mobile */}
        <div className="md:hidden">
          <FaBars size={24} onClick={toggleSidebar} className="cursor-pointer" />
        </div>
      </nav>

      {/* Search Bar for Mobile Screens */}
      <div className='px-4 py-1'>
        <div className="md:hidden flex items-center bg-white rounded-full relative">
          <input
            type="text"
            placeholder="Search for plants..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 px-4 text-green-900 outline-none bg-transparent"
          />
          <FaSearch onClick={handleSearch} className="text-green-800 mr-2 cursor-pointer" />

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute z-10 bg-green-100 shadow-lg rounded  w-full top-10">
              <ul>
                {suggestions.map((suggestion) => (
                  <li key={suggestion._id} className="px-4 py-2 text-black hover:bg-gray-200 cursor-pointer shadow-sm" onClick={()=>hadelSetSuggestion(suggestion._id)}>
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar for mobile */}
      <div
        className={`fixed top-0 left-0 h-full bg-green-700 text-white w-64 z-50 transition-transform transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 flex justify-between items-center">
          <div className="text-2xl font-bold">
            SproutiX
          </div>
          <FaTimes size={24} onClick={toggleSidebar} className="cursor-pointer" />
        </div>
        <ul className="space-y-3 mt-4 p-1">
        <Link to ="/"><li className="py-2 px-4 hover:bg-green-600 cursor-pointer flex items-center">
            <FaHome className="mr-2" />
            Home
          </li></Link>
          <Link to="/shop"><li className="py-2 px-4 hover:bg-green-600 cursor-pointer flex items-center">
            <FaShopify className="mr-2" />
            Shop
          </li></Link>
          <Link to="/categories"> <li className="py-2 px-4 hover:bg-green-600 cursor-pointer flex items-center">
            <FaTags className="mr-2" />
           Categories
          </li></Link>
          <Link to="/contact"><li className="py-2 px-4 hover:bg-green-600 cursor-pointer flex items-center">
            <FaEnvelope className="mr-2" />
            Contact
          </li></Link>
          <Link to="/user/cart"><li className="py-2 px-4 hover:bg-green-600 cursor-pointer flex items-center">
            <FaShoppingCart className="mr-2" />
            Cart
          </li></Link>
          {isLoggedIn ? (
            <Link to={'/user/profile'} className="flex items-center py-2 px-4 hover:bg-green-600 cursor-pointer">
              <img
                src={authUser?.photo}
                alt="User"
                className="w-8 h-8 rounded-full mr-2 object-cover"
              />
              <span>Profile</span>
            </Link>
          ) : (
            <li><Link to="/login" className="block py-2 px-4 hover:bg-green-600 cursor-pointer">Login</Link></li>
          )}
        </ul>
      </div>

      {/* Overlay when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
    </header>
  );
};

export default Navbar;
