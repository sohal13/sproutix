import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../../apiClient';
import Layout from './Components/Layout/Layout';
import AccountSettings from './Components/ProfilePageComponets/AccountSetting';
import LoadingSpinner from '../../components/LoadingSpinner';
import Orders from './Components/ProfilePageComponets/Orders';
import { userAuth } from '../../contextAPI/authContext';
import SellerMainPage from '../../forSeller/pages/SellerMainPage';
import SellerDashBord from '../../forSeller/pages/SellerDashBord';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
    const {authUser}=userAuth();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get('/api/user/profile');
            setLoading(false);
                setUser(response.data);
            } catch (error) {
            setLoading(false);
                toast.error('Error fetching profile data');
            }
        };

        fetchUserProfile();
    }, []);

    const renderProfileInfo = () => (
        <div className="p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
            <div className="space-y-2">
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Phone:</strong> {user?.phone || 'N/A'}</p>
            </div>
        </div>
    );

    const renderOrderHistory = () => (
        <div>
           <Orders user={authUser}/>
        </div>
    );

    const renderDashboard = () => (
        <div className="p-1 bg-white shadow-lg rounded-lg">
            <div className='flex items-center justify-between'>
            <h2 className="text-2xl font-semibold p-2">Wishlist</h2>
        <Link to={'/seller'} className='p-1 px-2 bg-green-500 rounded'>More Details</Link>
            </div>
<SellerDashBord/>
</div>
    );

    const renderWishlist = () => (
        <div className="p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Wishlist</h2>
            {/* Placeholder for wishlist items */}
            <p>Your wishlist is empty!</p>
        </div>
    );

    const renderAccountSettings = () => (
    <div>
           <AccountSettings/>
        </div>
    );

    return (
        <Layout>
            {loading ? (<LoadingSpinner/>):(
  <div className="container mx-auto p-4">
  <div className="flex flex-col items-center justify-center mb-8">
      <img 
          src={user?.photo || 'https://t4.ftcdn.net/jpg/03/40/12/49/360_F_340124934_bz3pQTLrdFpH92ekknuaTHy8JuXgG7fi.jpg'} 
          alt="Profile" 
          className="w-32 h-32 rounded-full object-cover mb-4 shadow-lg" 
      />
      <h1 className="text-3xl font-bold">{user?.name || 'User Name'}</h1>
      <p className="text-gray-500">{user?.email || 'user@example.com'}</p>
  </div>

  <div className="mb-8">
    {authUser.isSeller === false ? ( <div className="flex justify-center md:space-x-4 space-x-2 mb-6">
          {['profile', 'orders', 'wishlist', 'settings'].map(tab => (
              <button
                  key={tab}
                  className={`py-2 px-4 rounded-lg ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'} transition duration-300`}
                  onClick={() => setActiveTab(tab)}
              >
                  {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
              </button>
          ))}
      </div>):(
        <div className="flex justify-center md:space-x-4 space-x-2 mb-6">
        {['profile', 'dashboard', 'settings'].map(tab => (
            <button
                key={tab}
                className={`py-2 px-4 rounded-lg ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'} transition duration-300`}
                onClick={() => setActiveTab(tab)}
            >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
            </button>
        ))}
    </div>
      )}
    
      <div className="max-w-3xl mx-auto">
          {activeTab === 'profile' && renderProfileInfo()}
          { activeTab === 'orders' && renderOrderHistory()}
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'wishlist' && renderWishlist()}
          {activeTab === 'settings' && renderAccountSettings()}
      </div>
  </div>
</div>
            )}
      
        </Layout>
    );
};

export default ProfilePage;
