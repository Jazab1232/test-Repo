import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/config';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentUserUid, setCurrentUserUid] = useState(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setCurrentUserUid(user.uid)
        });
        return () => unsubscribe();
    }, []);


    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, currentUserUid, setCurrentUserUid }}>
            {children}
        </AuthContext.Provider>
    );
};
