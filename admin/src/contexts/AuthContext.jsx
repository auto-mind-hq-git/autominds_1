import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        setCurrentUser(null);
        localStorage.removeItem('autominds_admin_user');
        localStorage.removeItem('autominds_session_expiry');
    }, []);

    // Update session timer on user activity
    const resetSessionTimer = useCallback(() => {
        if (!currentUser) return;

        const expiryTime = Date.now() + SESSION_TIMEOUT;
        localStorage.setItem('autominds_session_expiry', expiryTime.toString());
    }, [currentUser]);

    // Check session validity
    const checkSession = useCallback(() => {
        const storedUser = localStorage.getItem('autominds_admin_user');
        const expiryTime = localStorage.getItem('autominds_session_expiry');

        if (storedUser && expiryTime) {
            if (Date.now() > parseInt(expiryTime, 10)) {
                // Session expired
                logout();
                return false;
            }
            return true;
        }
        return false;
    }, [logout]);

    useEffect(() => {
        // Initial Auth Check
        const storedUser = localStorage.getItem('autominds_admin_user');
        if (storedUser) {
            if (checkSession()) {
                setCurrentUser(JSON.parse(storedUser));
                resetSessionTimer();
            }
        }
        setLoading(false);
    }, [checkSession, resetSessionTimer]);

    useEffect(() => {
        // Activity Listeners for Auto-Logout
        if (!currentUser) return;

        const handleActivity = () => resetSessionTimer();

        // Check session expiry periodically
        const interval = setInterval(() => {
            if (!checkSession()) {
                // Session expired check handled in checkSession calls logout
            }
        }, 60000); // Check every minute

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keypress', handleActivity);
        window.addEventListener('click', handleActivity);
        window.addEventListener('scroll', handleActivity);

        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keypress', handleActivity);
            window.removeEventListener('click', handleActivity);
            window.removeEventListener('scroll', handleActivity);
            clearInterval(interval);
        };
    }, [currentUser, resetSessionTimer, checkSession]);

    const login = async (username, password) => {
        // Mock Login Logic
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (username === 'Automindsadmin' && password === 'Autominds123admin') {
                    const user = { username, name: 'Admin User', role: 'admin' };
                    setCurrentUser(user);
                    localStorage.setItem('autominds_admin_user', JSON.stringify(user));
                    resetSessionTimer(); // Initialize timer
                    resolve(user);
                } else {
                    reject(new Error('Invalid username or password'));
                }
            }, 800); // Simulate network delay
        });
    };

    const value = {
        currentUser,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
