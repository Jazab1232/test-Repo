import React, { useContext, useState } from 'react'
import '../styles/header.css'
import logo from '../assets/logo.jpg'
import { AuthContext } from './context/AuthContext';
import { signOut } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './config/config';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { AppContext } from './context/AppContext';

export default function Header() {
  const [loading, setLoading] = useState(false)
  let navigate = useNavigate()
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const { showNotifications, setShowNotifications } = useContext(AppContext);
  const logout = async () => {
    try {
      setLoading(true)
      await signOut(auth);
      setCurrentUser(null);
      navigate('/login');
      setLoading(false)
      setShowNotifications(false)
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
        <i class="fa-regular fa-bell" onClick={() => { setShowNotifications(!showNotifications) }} > </i>
        <Link to={`/profile`} className="profileIcon">
          <span style={{ textTransform: 'capitalize' }}>{icon}</span>
        </Link>
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
