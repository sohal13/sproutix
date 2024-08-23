import React from 'react'
import { userAuth } from '../../contextAPI/authContext'
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

const ISUser = () => {
    const {authUser} = userAuth();
    console.log(authUser);
   
  return (
    authUser ? <Outlet/> : <Navigate to={'/'} notfication={toast.info('Sorry!! Only User Can Access the Page',{autoClose:2000})}/>
  )
}

export default ISUser;