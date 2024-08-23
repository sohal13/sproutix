import React from 'react'
import { userAuth } from '../../contextAPI/authContext'
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

const ISSeller = () => {
    const {authUser} = userAuth();
    console.log(authUser);
   
  return (
    authUser?.isSeller === true ? <Outlet/> : <Navigate to={'/'}/>
  )
}

export default ISSeller;