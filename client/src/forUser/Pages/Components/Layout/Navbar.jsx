// src/components/Navbar.jsx
import React, { useEffect, useState } from 'react';
import { FaBars, FaTimes, FaShoppingCart, FaUserCircle, FaHome, FaShopify, FaEnvelope, FaTags, FaSearch } from 'react-icons/fa';
import { userAuth } from '../../../../contextAPI/authContext';
import { useLocation, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const {authUser } = userAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
  return (
    <header className="bg-green-600 text-white">
      <nav className="container mx-auto p-4 flex justify-between items-center">
        {/* Logo */}
        <Link to={'/'} className="text-2xl font-bold">
          SproutiX
        </Link>

        {/* Search Bar for Large Screens */} 
        <div className="hidden md:flex flex-1 mx-8 items-center bg-white rounded-full">
          <input
            type="text"
            placeholder="Search for plants..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 px-4 text-green-900 outline-none bg-transparent"
          />
           <FaSearch onClick={handleSearch} className="mr-2 text-green-800 cursor-pointer" />
        </div>

        {/* Links for large screens */}
        <ul className="hidden md:flex space-x-2 items-center">
          <li className="bg-white text-green-600 px-4 py-2 rounded-full hover:bg-gray-200 cursor-pointer flex items-center">
            <FaHome className="mr-2" />
            <Link to="/">Home</Link>
          </li>
          <li className="bg-white text-green-600 px-4 py-2 rounded-full hover:bg-gray-200 cursor-pointer flex items-center">
            <FaTags className="mr-2" />
            <Link to="/category">Category</Link>
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
            <li className="bg-green-800 text-black px-4 py-2 rounded-full hover:bg-gray-200 cursor-pointer flex items-center">
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
      <div className="md:hidden flex items-center  bg-white rounded-full">
        <input
          type="text"
          placeholder="Search for plants..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-2 px-4 text-green-900 outline-none bg-transparent"
        />
         <FaSearch onClick={handleSearch} className="text-green-800 mr-2 cursor-pointer " />
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
          <li className="py-2 px-4 hover:bg-green-600 cursor-pointer flex items-center">
            <FaHome className="mr-2" />
            <Link to ="/">Home</Link>
          </li>
          <li className="py-2 px-4 hover:bg-green-600 cursor-pointer flex items-center">
            <FaShopify className="mr-2" />
            <Link to="/shop">Shop</Link>
          </li>
          <li className="py-2 px-4 hover:bg-green-600 cursor-pointer flex items-center">
            <FaTags className="mr-2" />
            <Link to="/category">Category</Link>
          </li>
          <li className="py-2 px-4 hover:bg-green-600 cursor-pointer flex items-center">
            <FaEnvelope className="mr-2" />
            <Link to="/co ntact">Contact</Link>
          </li>
          <li className="py-2 px-4 hover:bg-green-600 cursor-pointer flex items-center">
            <FaShoppingCart className="mr-2" />
            <Link to="/user/cart">Cart</Link>
          </li>
          {isLoggedIn ? (
            <Link to={'/user/profile'} className="flex items-center py-2 px-4 hover:bg-green-600 cursor-pointer">
              <img
                src={authUser?.photo}
                alt="User"
                className="w-8 h-8 rounded-full mr-2"
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
