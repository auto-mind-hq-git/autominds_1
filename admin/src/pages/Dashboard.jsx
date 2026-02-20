import React, { useState, useEffect } from 'react';
import { Activity, Users, Briefcase, Layers } from 'lucide-react';
import { DataService } from '../services/dataService';

const Dashboard = () => {
    const [counts, setCounts] = useState({
        projects: 0,
        services: 0,
        testimonials: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Seed default data if database is empty (one-time)
                await DataService.checkAndSeedDatabase();

                // Auto-cleanup duplicates once per session (safety net)
                if (!sessionStorage.getItem('autominds_cleanup_done')) {
                    try {
                        const stats = await DataService.cleanupDuplicates();
                        const total = stats.services + stats.projects + stats.testimonials;
                        if (total > 0) {
                            console.log(`Cleaned ${total} duplicates:`, stats);
                        }
                        sessionStorage.setItem('autominds_cleanup_done', 'true');
                    } catch (cleanupErr) {
                        console.warn("Cleanup skipped:", cleanupErr.message);
                    }
                }

                const [projects, services, testimonials] = await Promise.all([
                    DataService.getProjects(),
                    DataService.getServices(),
                    DataService.getTestimonials()
                ]);
                setCounts({
                    projects: (projects || []).length,
                    services: (services || []).length,
                    testimonials: (testimonials || []).length
                });
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Derived stats from real data
    const stats = [
        { label: 'Total Projects', value: loading ? '...' : counts.projects.toString(), icon: Briefcase, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
        { label: 'Active Services', value: loading ? '...' : counts.services.toString(), icon: Layers, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { label: 'Client Testimonials', value: loading ? '...' : counts.testimonials.toString(), icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'System Status', value: 'Online', icon: Activity, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white font-orbitron tracking-wide">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="card p-6 flex items-center border border-slate-700 bg-slate-800/50 backdrop-blur-sm">
                            <div className={`p-3 rounded-lg ${stat.bg} mr-4`}>
                                <Icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions / Getting Started */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-6">
                    <h2 className="text-lg font-medium text-white mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <a href="/projects" className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors text-center text-sm text-slate-300">
                            Manage Projects
                        </a>
                        <a href="/services" className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors text-center text-sm text-slate-300">
                            Edit Services
                        </a>
                    </div>
                </div>

                <div className="card border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-6">
                    <h2 className="text-lg font-medium text-white mb-2">System Health</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm text-slate-400 border-b border-slate-700/50 pb-2">
                            <span>Database Connection</span>
                            <span className="text-emerald-400 font-medium">Connected</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-slate-400 border-b border-slate-700/50 pb-2">
                            <span>Last Sync</span>
                            <span className="text-slate-300">Real-time</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-slate-400">
                            <span>Admin Version</span>
                            <span className="text-slate-500">v1.0.2</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
