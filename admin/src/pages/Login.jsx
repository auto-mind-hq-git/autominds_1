import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, Hexagon } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(username, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to sign in: ' + err.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a1628] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px]"></div>
                <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-md w-full space-y-8 bg-slate-900/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-slate-700 z-10 relative">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20 transform rotate-45">
                        <Hexagon className="h-8 w-8 text-white transform -rotate-45" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-white font-orbitron tracking-wider">
                        AUTOMINDS
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                        Secure Admin Access
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border-l-4 border-red-500 p-4 text-red-400 text-sm rounded" role="alert">
                        <p>{error}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="relative group">
                            <label htmlFor="username" className="sr-only">
                                Username
                            </label>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                            </div>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                className="block w-full pl-10 px-3 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="relative group">
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                required
                                className="block w-full pl-10 pr-10 px-3 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div
                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-slate-500 hover:text-slate-300" />
                                ) : (
                                    <Eye className="h-5 w-5 text-slate-500 hover:text-slate-300" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-cyan-500/30 font-orbitron tracking-wide"
                        >
                            {loading ? 'AUTHENTICATING...' : 'ACCESS DASHBOARD'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
