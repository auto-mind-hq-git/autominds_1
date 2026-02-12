import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    Layers,
    MessageSquare,
    BarChart2,
    Settings,
    LogOut,
    User,
    Bell
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
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
        <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col h-full">
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 font-orbitron tracking-wider">
                    AUTOMINDS
                </span>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-3">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${isActive
                                            ? 'bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-400'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                        }`
                                    }
                                >
                                    <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
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
    );
};

export const Topbar = () => {
    const { currentUser } = useAuth();

    return (
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 lg:px-8">
            <div className="flex items-center md:hidden">
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
                    <div className="flex flex-col text-right hidden sm:block">
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

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen bg-[#0a1628] overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
