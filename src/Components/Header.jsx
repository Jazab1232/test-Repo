import React, { useContext, useState } from 'react'
import '../styles/header.css'
import logo from '../assets/logo.jpg'
import { AuthContext } from './context/AuthContext';
import { signOut } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './config/config';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

export default function Header() {
  const [loading, setLoading] = useState(false)
  let navigate = useNavigate()
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const logout = async () => {
    try {
      setLoading(true)
      await signOut(auth);
      setCurrentUser(null);
      navigate('/login');
      setLoading(false)
      toast.warn('You are logged out', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error) {
      toast.error('You are logged out', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      setLoading(false)
    }
  };

  let icon = 'A'
  if (currentUser) {
    icon = currentUser.email.charAt(0)
  }

  return (
    <div className='header'>
      <Link to={'/'} className="logo">
        <img src={logo} alt="logo" />
      </Link>
      <div className="navIcons">
        {/* <i className="fa-regular fa-bell"></i> */}
        <div className="profileIcon">
          <span style={{ textTransform: 'capitalize' }}>{icon}</span>
        </div>
        <div className="logout" >
          <p style={{ cursor: 'pointer' }} onClick={logout}>
            {loading ? (
              <ClipLoader color="#ffffff" loading={loading} size={20} />
            ) : (
              "Logout"
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
