import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Testimonials from './pages/Testimonials';
import Settings from './pages/Settings';

// Auth guard - redirects to login if not authenticated
const AuthGuard = () => {
    const { currentUser } = useAuth();
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};

// Layout wrapper renders children via Outlet
const LayoutWrapper = () => {
    const location = useLocation();
    return (
        <Layout>
            <Outlet key={location.pathname} />
        </Layout>
    );
};

// Root wrapper provides auth context to all routes
const RootLayout = () => {
    return (
        <AuthProvider>
            <Outlet />
        </AuthProvider>
    );
};

const router = createBrowserRouter(
    [
        {
            element: <RootLayout />,
            children: [
                {
                    path: '/login',
                    element: <Login />,
                },
                {
                    element: <AuthGuard />,
                    children: [
                        {
                            element: <LayoutWrapper />,
                            children: [
                                {
                                    index: true,
                                    element: <Navigate to="/dashboard" replace />,
                                },
                                {
                                    path: 'dashboard',
                                    element: <Dashboard />,
                                },
                                {
                                    path: 'services',
                                    element: <Services />,
                                },
                                {
                                    path: 'portfolio',
                                    element: <Projects />,
                                },
                                {
                                    path: 'testimonials',
                                    element: <Testimonials />,
                                },
                                {
                                    path: 'statistics',
                                    element: <Settings />,
                                },
                                {
                                    path: 'settings',
                                    element: <Settings />,
                                },
                            ],
                        },
                    ],
                },
                {
                    path: '*',
                    element: <Navigate to="/login" replace />,
                },
            ],
        },
    ],
    {
        basename: '/admin',
    }
);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
