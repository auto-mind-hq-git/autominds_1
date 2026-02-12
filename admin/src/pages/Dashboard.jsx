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
                const [projects, services, testimonials] = await Promise.all([
                    DataService.getProjects(),
                    DataService.getServices(),
                    DataService.getTestimonials()
                ]);
                setCounts({
                    projects: projects.length,
                    services: services.length,
                    testimonials: testimonials.length
                });
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
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
        { label: 'Last Updated', value: 'Just now', icon: Activity, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    ];

    const activities = [
        { id: 1, text: 'System Synchronized with Main Website', time: 'Just now' },
        { id: 2, text: 'Real Data Loaded Successfully', time: '1 minute ago' },
        { id: 3, text: 'Admin Panel Theme Updated to Cosmic', time: '5 minutes ago' },
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

            <div className="card overflow-hidden border border-slate-700 bg-slate-800/50 backdrop-blur-sm">
                <div className="px-6 py-4 border-b border-slate-700">
                    <h2 className="text-lg font-medium text-white">Recent Activity</h2>
                </div>
                <div className="p-6">
                    <ul className="space-y-4">
                        {activities.map((activity) => (
                            <li key={activity.id} className="flex items-start pb-4 border-b border-slate-700/50 last:border-0 last:pb-0">
                                <div className="h-2 w-2 mt-2 rounded-full bg-cyan-500 mr-4 shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                                <div className="flex-1">
                                    <p className="text-sm text-slate-200 font-medium">{activity.text}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{activity.time}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
