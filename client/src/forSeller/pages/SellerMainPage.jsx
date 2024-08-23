// src/pages/SellerMainPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaBoxOpen, FaShoppingCart, FaUser, FaCog, FaBars, FaStar, FaChartLine, FaDollarSign, FaBell } from 'react-icons/fa';
import SellerDashBord from './SellerDashBord';

const SellerMainPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  return (
    <div className="container flex min-h-screen bg-gray-100">
      {/* Sidebar for Large Screens */}
      <aside className={`fixed top-0 right-0 z-20 w-64 bg-green-800 text-white p-6 md:relative md:w-64 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
        <h2 className="text-2xl font-bold mb-8">Seller Portal</h2>
        <nav>
          <ul>
            <li className={`mb-4 ${activeSection === 'dashboard' ? 'bg-green-600' : ''}`}>
              <Link 
                to="/seller/dashboard" 
                onClick={() => setActiveSection('dashboard')}
                className="flex items-center p-3 rounded hover:bg-green-700 cursor-pointer"
              >
                <FaTachometerAlt className="text-xl mr-2" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li className={`mb-4 ${activeSection === 'products' ? 'bg-green-600' : ''}`}>
              <Link 
                to="/seller/manageproduct" 
                onClick={() => setActiveSection('products')}
                className="flex items-center p-3 rounded hover:bg-green-700 cursor-pointer"
              >
                <FaBoxOpen className="text-xl mr-2" />
                <span>Manage Products</span>
              </Link>
            </li>
            <li className={`mb-4 ${activeSection === 'orders' ? 'bg-green-600' : ''}`}>
              <Link 
                to="/seller/orders" 
                onClick={() => setActiveSection('orders')}
                className="flex items-center p-3 rounded hover:bg-green-700 cursor-pointer"
              >
                <FaShoppingCart className="text-xl mr-2" />
                <span>Orders</span>
              </Link>
            </li>
            <li className={`mb-4 ${activeSection === 'settings' ? 'bg-green-600' : ''}`}>
              <Link 
                to="/seller/notification" 
                onClick={() => setActiveSection('notification')}
                className="flex items-center p-3 rounded hover:bg-green-700 cursor-pointer"
              >
                <FaBell className="text-xl mr-2" />
                <span>Notification</span>
              </Link>
            </li>
            <li className={`mb-4 ${activeSection === 'profile' ? 'bg-green-600' : ''}`}>
              <Link 
                to="/seller/profile" 
                onClick={() => setActiveSection('profile')}
                className="flex items-center p-3 rounded hover:bg-green-700 cursor-pointer"
              >
                <FaUser className="text-xl mr-2" />
                <span>Profile</span>
              </Link>
            </li>
            <li className={`mb-4 ${activeSection === 'settings' ? 'bg-green-600' : ''}`}>
              <Link 
                to="/seller/settings" 
                onClick={() => setActiveSection('settings')}
                className="flex items-center p-3 rounded hover:bg-green-700 cursor-pointer"
              >
                <FaCog className="text-xl mr-2" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Sidebar Toggle Button for Mobile */}
      <div className="fixed top-0 right-0 z-30 p-4 md:hidden">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-green-800 text-white rounded-md"
        >
          <FaBars className="text-2xl" />
        </button>
      </div>

      {/* Main Content */}
      <main className={`container p-2 ${sidebarOpen ? '' : ''}`}>
        <h1 className="text-3xl font-bold mb-6 text-green-700">Seller Dashboard</h1>
        <SellerDashBord/>
      </main>
    </div>
  );
};

export default SellerMainPage;
