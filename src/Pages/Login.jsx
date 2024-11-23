import React, { useContext, useEffect, useState } from 'react';
import '../styles/login.css';
import { auth } from '../Components/config/config';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Components/context/AuthContext';
import { ClipLoader } from 'react-spinners';
import { Bounce, toast } from 'react-toastify';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordReset, setIsPasswordReset] = useState(false);
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        if (currentUser) {
            navigate('/dashboard');
        }
    }, [currentUser, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('Logged in successfully', { theme: 'colored', transition: Bounce });
            setTimeout(() => navigate('/dashboard'), 3000);
        } catch (error) {
            toast.warn(`Error logging in: ${error.message}`, { theme: 'colored', transition: Bounce });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success('Password reset email sent successfully!', { theme: 'colored' });
            setIsPasswordReset(false);
        } catch (error) {
            toast.error(`Error: ${error.message}`, { theme: 'colored' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>{isPasswordReset ? 'Reset Password' : 'Login'}</h2>
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
                {!isPasswordReset && (
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
                )}
                {!isPasswordReset ? (
                    <button onClick={handleLogin} className="loginBtn" disabled={loading}>
                        {loading ? <ClipLoader color="#fff" size={20} /> : 'Login'}
                    </button>
                ) : (
                    <button onClick={handlePasswordReset} className="loginBtn" disabled={loading}>
                        {loading ? <ClipLoader color="#fff" size={20} /> : 'Reset Password'}
                    </button>
                )}
                <p className="resetPassLink" onClick={() => setIsPasswordReset(!isPasswordReset)}>
                    {isPasswordReset ? 'Back to Login' : 'Forgot Password?'}
                </p>
            </div>
        </div>
    );
}
