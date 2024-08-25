import React from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { userAuth } from '../../../../contextAPI/authContext';
import axios from 'axios';


const AccountSettings = () => {
    const {authUser} = userAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logout');
            toast.success('Logged out successfully');
            navigate('/')
        } catch (error) {
            toast.error('Failed to logout');
        }
    };

    const handleProfileClick = () => {
        navigate(`/user/profile/update/${authUser?._id}`);
    };

    const handleBecomeSellerClick=()=>{
        navigate(`/user/profile/becomeseller/${authUser?._id}`);
    }

    return (
        <div className="p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>

            {/* Profile Information */}
            <div className="p-4 bg-gray-100 rounded-lg mb-4 cursor-pointer hover:bg-gray-300" onClick={handleProfileClick}>
                <h3 className="text-xl font-semibold mb-2">Profile Information</h3>
                <p>Update your name, email, phone number, and profile photo.</p>
            </div>

            {/* Change Password */}
            <div className="p-4 bg-gray-100 rounded-lg mb-4 cursor-pointer  hover:bg-gray-300">
                <h3 className="text-xl font-semibold mb-2">Change Password</h3>
                <p>Change your current password to a new one.</p> 
                {/* Add form elements for changing password */}
                {/* Placeholder for password change form */}
            </div>
 
            {/* Subscription and Billing */}
            <div className="p-4 bg-gray-100 rounded-lg mb-4 cursor-pointer  hover:bg-gray-300">
                <h3 className="text-xl font-semibold mb-2">Subscription and Billing</h3>
                <p>Manage your subscription and view billing history.</p>
                {/* Add options for subscription and billing */}
                {/* Placeholder for subscription and billing */}
            </div>
              {authUser.isSeller === false &&<div className="p-4 bg-red-100 rounded-lg mb-4 cursor-pointer hover:bg-gray-300" onClick={handleBecomeSellerClick}>
                <h3 className="text-xl font-semibold mb-2">Become Selling Partner</h3>
                <p className='text-red-400 uppercase text-[10px]'>Click on this only if you want to be a product seller </p>
                {/* Add options for subscription and billing */}
                {/* Placeholder for subscription and billing */}
            </div>}
            {/* Logout Button */}
            <div className="flex justify-center mt-6">
                <button
                    className="py-2 px-4 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AccountSettings;
