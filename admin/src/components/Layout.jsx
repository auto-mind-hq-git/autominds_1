import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    Layers,
    MessageSquare,
    BarChart2,
    Settings,
    LogOut,
    Menu,
    X,
    Bell
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/services', label: 'Services', icon: Layers },
        { path: '/portfolio', label: 'Portfolio', icon: Briefcase },
        { path: '/testimonials', label: 'Testimonials', icon: MessageSquare },
        { path: '/statistics', label: 'Statistics', icon: BarChart2 },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar Container */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full transition-transform duration-300 transform 
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 font-orbitron tracking-wider">
                        AUTOMINDS
                    </span>
                    <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-3">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        onClick={() => onClose && window.innerWidth < 768 && onClose()}
                                        className={({ isActive }) =>
                                            `flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${isActive
                                                ? 'bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-400'
                                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                            }`
                                        }
                                    >
                                        <Icon className="h-5 w-5 mr-3" />
                                        {item.label}
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <LogOut className="h-5 w-5 mr-3" />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
};

export const Topbar = ({ onMenuClick }) => {
    const { currentUser } = useAuth();

    return (
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center md:hidden">
                <button onClick={onMenuClick} className="text-slate-400 hover:text-white mr-4">
                    <Menu className="h-6 w-6" />
                </button>
                <span className="font-bold text-white font-orbitron">AUTOMINDS</span>
            </div>

            {/* Spacer for desktop where logo is in sidebar */}
            <div className="hidden md:block"></div>

            <div className="flex items-center space-x-4">
                <button className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 relative transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-cyan-500 ring-2 ring-slate-900"></span>
                </button>
                <div className="flex items-center space-x-3 border-l border-slate-700 pl-4">
                    <div className="hidden sm:flex flex-col text-right">
                        <span className="text-sm font-medium text-slate-200">{currentUser?.name || 'Admin'}</span>
                        <span className="text-xs text-slate-500">Administrator</span>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold border border-cyan-500/30">
                        {currentUser?.name ? currentUser.name.charAt(0) : 'A'}
                    </div>
                </div>
            </div>
        </header>
    )
}

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="flex h-screen bg-[#0a1628] overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar relative">
                    <div className="max-w-7xl mx-auto" key={location.pathname}>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
