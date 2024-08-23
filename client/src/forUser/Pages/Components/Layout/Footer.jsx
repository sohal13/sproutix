// src/components/Footer.jsx
import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-green-800 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">About PlantSell</h3>
            <p className="text-sm">
              PlantSell connects local plant sellers with buyers, offering a wide variety of plants for every type of gardener. Join our community to explore a rich selection of greenery.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-green-300">Home</a></li>
              <li><a href="#" className="hover:text-green-300">Shop</a></li>
              <li><a href="#" className="hover:text-green-300">Categories</a></li>
              <li><a href="#" className="hover:text-green-300">Contact</a></li>
              <li><a href="#" className="hover:text-green-300">Cart</a></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                <span>123 Plant Street, Green City, 45678</span>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="mr-2" />
                <span>+91 9876543210</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-2" />
                <span>info@plantsell.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-green-300"><FaFacebookF size={24} /></a>
              <a href="#" className="hover:text-green-300"><FaInstagram size={24} /></a>
              <a href="#" className="hover:text-green-300"><FaTwitter size={24} /></a>
              <a href="#" className="hover:text-green-300"><FaLinkedinIn size={24} /></a>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-green-300 mt-8">
          © 2024 PlantSell. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
