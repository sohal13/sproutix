// src/pages/SellerDashBord.jsx
import React from 'react';
import { FaDollarSign, FaBoxOpen, FaChartLine, FaStar } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const SellerDashBord = () => {
  // Example data
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Sales',
        data: [30, 40, 35, 50, 60, 70, 65],
        fill: false,
        borderColor: '#4caf50',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="bg-gray-100 container">
      <div className="max-w-7xl mx-auto">        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-6 ">
          {/* Sales Overview Card */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
            <div className="bg-green-600 p-3 rounded-full text-white">
              <FaDollarSign className="text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Total Sales</h2>
              <p className="text-2xl font-bold text-green-600">$12,345</p>
            </div>
          </div>

          {/* Orders Overview Card */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
            <div className="bg-blue-600 p-3 rounded-full text-white">
              <FaBoxOpen className="text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Total Orders</h2>
              <p className="text-2xl font-bold text-blue-600">123</p>
            </div>
          </div>

          {/* Performance Overview Card */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
            <div className="bg-yellow-600 p-3 rounded-full text-white">
              <FaChartLine className="text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Performance</h2>
              <p className="text-2xl font-bold text-yellow-600">80%</p>
            </div>
          </div>
        </div>

        {/* Sales Trend Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 h-[5%]">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sales Trend</h2>
          <Line data={data} options={{ responsive: true, plugins: { legend: { display: false } } }} className='h-auto' />
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow-md ">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Orders</h2>
          <div className='overflow-x-auto'>
          <table className="w-full border-collapse ">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="px-4 py-2 border-b">Order ID</th>
                <th className="px-4 py-2 border-b">Customer</th>
                <th className="px-4 py-2 border-b">Total</th>
                <th className="px-4 py-2 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border-b">#12345</td>
                <td className="px-4 py-2 border-b">John Doe</td>
                <td className="px-4 py-2 border-b">$120</td>
                <td className="px-4 py-2 border-b text-green-600">Shipped</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">#12346</td>
                <td className="px-4 py-2 border-b">Jane Smith</td>
                <td className="px-4 py-2 border-b">$80</td>
                <td className="px-4 py-2 border-b text-yellow-600">Processing</td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashBord;
