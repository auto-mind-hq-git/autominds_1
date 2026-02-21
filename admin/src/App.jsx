import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import AdminLayout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Testimonials from './pages/Testimonials';
import Settings from './pages/Settings';

// Custom navigation context
const NavigationContext = createContext(null);
export const useNavigation = () => useContext(NavigationContext);

// Get the current page from the URL pathname
const getPageFromURL = () => {
    const path = window.location.pathname.replace(/^\/admin\/?/, '').replace(/\/$/, '') || 'dashboard';
    return path;
};

// Navigation provider manages current page state
const NavigationProvider = ({ children }) => {
    const [currentPage, setCurrentPage] = useState(getPageFromURL);

    // Navigate to a new page
    const navigate = useCallback((page) => {
        const cleanPage = page.replace(/^\//, '');
        setCurrentPage(cleanPage);
        window.history.pushState({ page: cleanPage }, '', `/admin/${cleanPage}`);
    }, []);

    // Handle browser back/forward buttons
    useEffect(() => {
        const handlePopState = () => {
            setCurrentPage(getPageFromURL());
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    return (
        <NavigationContext.Provider value={{ currentPage, navigate }}>
            {children}
        </NavigationContext.Provider>
    );
};

// Render the correct page component based on current page
const PageRenderer = () => {
    const { currentPage } = useNavigation();

    switch (currentPage) {
        case 'dashboard':
            return <Dashboard />;
        case 'services':
            return <Services />;
        case 'portfolio':
            return <Projects />;
        case 'testimonials':
            return <Testimonials />;
        case 'statistics':
            return <Settings />;
        case 'settings':
            return <Settings />;
        default:
            return <Dashboard />;
    }
};

// Main authenticated app with layout
const AuthenticatedApp = () => {
    return (
        <NavigationProvider>
            <AdminLayout>
                <PageRenderer />
            </AdminLayout>
        </NavigationProvider>
    );
};

// Root app handles auth gating
const AppContent = () => {
    const { currentUser } = useAuth();
    const [showLogin, setShowLogin] = useState(!currentUser);

    useEffect(() => {
        setShowLogin(!currentUser);
    }, [currentUser]);

    if (showLogin || !currentUser) {
        return <Login onLoginSuccess={() => {
            setShowLogin(false);
            window.history.replaceState({}, '', '/admin/dashboard');
        }} />;
    }

    return <AuthenticatedApp />;
};

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
