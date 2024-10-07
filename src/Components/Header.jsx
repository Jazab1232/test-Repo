import React, { useContext } from 'react'
import '../styles/header.css'
import logo from '../assets/logo.jpg'
import { AuthContext } from './context/AuthContext';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from './config/config';

export default function Header() {
  let navigate =useNavigate()
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null); // Clear current user
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  let icon = 'A'
   if (currentUser) {
    icon=currentUser.email.charAt(0)
   }
  
  return (
    <div className='header'>
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>
      <div className="navIcons">
        {/* <i className="fa-regular fa-bell"></i> */}
        <div className="profileIcon">
          <span style={{textTransform:'capitalize'}}>{icon}</span>
        </div>
        <div className="logout" >
          <p style={{cursor:'pointer'}} onClick={logout}>Logout</p>
        </div>
      </div>
    </div>
  )
}
