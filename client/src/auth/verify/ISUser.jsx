import React from 'react'
import { userAuth } from '../../contextAPI/authContext'
import { Navigate, Outlet } from 'react-router-dom';

const ISUser = () => {
    const {authUser} = userAuth();
    console.log(authUser);
   
  return (
    authUser ? <Outlet/> : <Navigate to={'/login'}/>
  )
}

export default ISUser;