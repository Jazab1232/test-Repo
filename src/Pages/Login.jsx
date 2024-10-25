// Login.jsx
import React, { useContext, useEffect, useState } from 'react';
import '../styles/login.css';
import logo from '../assets/logo.jpg';
import { auth } from '../Components/config/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Components/context/AuthContext';
import { ClipLoader } from 'react-spinners';

export default function Login() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useContext(AuthContext);

    useEffect(() => {
        if (currentUser) {
            const timer = setTimeout(() => {
                navigate('/dashboard');
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [currentUser, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            await signInWithEmailAndPassword(auth, email, password);
            setLoading(false)
            navigate('/dashboard');

        } catch (error) {
            console.error('Error logging in:', error.message);
        }
    };
    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                {error && <p className="error">{error}</p>}
                <div className="input-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button onClick={handleLogin} type="submit">
                    {loading ? (
                        <ClipLoader color="#ffffff" loading={loading} size={20} />
                    ) : (
                        "Login"
                    )}
                </button>
            </div>
        </div>
    );
}
