import axios from 'axios'
import React, { useContext } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { createContext, useEffect } from 'react'
import { UserContext } from '../context/userContext'


const Logout = () => {
  const {setCurrentUser} = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(()=>{
    setCurrentUser(null);
    navigate('/login');
  })
  return (
    <></>
  )
}

export default Logout