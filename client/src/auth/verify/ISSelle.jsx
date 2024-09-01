import React from 'react'
import { userAuth } from '../../contextAPI/authContext'
import { Navigate, Outlet } from 'react-router-dom';

const ISSeller = () => {
    const {authUser} = userAuth();
  return (
    authUser?.isSeller === true ? <Outlet/> : <Navigate to={'/'}/>
  )
}

export default ISSeller;