// src/components/Layout.jsx
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar at the top */}
      <header>
        <Navbar />
      </header>

      {/* Main content in the center */}
      <main className="flex-grow min-h-screen bg-gray-100">
        {children}
      </main>

      {/* Footer at the bottom */}
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
