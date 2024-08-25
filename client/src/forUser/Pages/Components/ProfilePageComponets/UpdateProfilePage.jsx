import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../firebaseConfig';
import { userAuth } from '../../../../contextAPI/authContext';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import apiClient from '../../../../apiClient';


const UpdateProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
  const { authUser,setauthUser } = userAuth();
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        photo: '',
        password: '',
    });
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get(`/api/user/profile`);
            setLoading(false);
                setUser(response.data);
            } catch (error) {
            setLoading(false);
                toast.error('Error fetching user data');
            }
        };

        fetchUser();
    }, [authUser]);

    const handleChange = (e) => {
        const { name, defaultValue } = e.target;
        setUser({
            ...user,
            [name]: defaultValue,
        });
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setUploading(true);
        const fileRef = ref(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setUploadProgress(progress);
            },
            (error) => {
                setUploading(false);
                toast.error('Error uploading photo');
            },
            async () => {
                try {
                    const photoURL = await getDownloadURL(fileRef);
                    const response = await apiClient.put(`/api/user/profile/update/${id}`, { ...user, photo: photoURL });
                    toast.success('Profile updated successfully');
                    localStorage.setItem('plantebuy_user', JSON.stringify(response.data));
                    setauthUser((prevUser) => ({ ...prevUser, photo: photoURL }));
                    setFile(null);
                    setUploadProgress(0);
                    navigate('/user/profile')
                } catch (error) {
                    toast.error('Error updating profile');
                } finally {
                    setUploading(false);
                }
            }
        );
    };

    return (
        <div className="container mx-auto p-4">
            {loading ? (<LoadingSpinner/>):(
   <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
   <h1 className="text-3xl font-bold mb-4">Update Profile</h1>

   <div className="flex justify-center items-center mb-6">
       <div className="relative w-32 h-32">
           <img
               src={file ? URL.createObjectURL(file) : user.photo || 'https://via.placeholder.com/150'}
               alt="Profile"
               className="w-full h-full object-cover rounded-full border-2 border-gray-300"
           />
           <div className="absolute inset-0 flex items-center justify-center bg-gray-300 bg-opacity-50 rounded-full text-white text-lg font-semibold">
               <label
                   htmlFor="file-input"
                   className="cursor-pointer"
               >
                   {file ? 'Change Photo' : 'Upload Photo'}
                   <input
                       type="file"
                       id="file-input"
                       onChange={handleFileChange}
                       className="hidden"
                   />
               </label>
           </div>
       </div>
   </div>

   {file && (
       <div className="flex flex-col items-center">
           <button
               onClick={handleSubmit}
               className={`mt-2 py-2 px-4 rounded-lg text-white ${
                   uploading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'
               }`}
               disabled={uploading}
           >
               {uploading ? `Uploading ${uploadProgress}%` : 'Upload Photo'}
           </button>
       </div>
   )}

   <form onSubmit={handleSubmit}>
       <div className="mb-4">
           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
               Name
           </label>
           <input
               type="text"
               id="name"
               name="name"
               defaultValue={user?.name}
               onChange={handleChange}
               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               required
           />
       </div>

       <div className="mb-4">
           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
               Email
           </label>
           <input
               type="email"
               id="email"
               name="email"
               defaultValue={user.email}
               onChange={handleChange}
               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               required
           />
       </div>

       <div className="mb-4">
           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
               Phone Number
           </label>
           <input
               type="text"
               id="phone"
               name="phone"
               defaultValue={user.phone}
               onChange={handleChange}
               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
           />
       </div>

       <div className="flex items-center justify-between">
           <button
               type="submit"
               disabled={uploading}
               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
           >
               Update Profile
           </button>
       </div>
   </form>
</div>
            )}
        </div>
    );
};

export default UpdateProfilePage;
