import React, { useState } from 'react';
import { Save, RefreshCw, Database, Trash2 } from 'lucide-react';
import { DataService } from '../services/dataService';

const Settings = () => {
    const [loading, setLoading] = useState(false);
    const [seedLoading, setSeedLoading] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        setLoading(true);
        // Mock save
        setTimeout(() => setLoading(false), 1000);
    };

    const handleSeedDatabase = async () => {
        if (!confirm('This will upload default data to the database. Continue?')) return;

        setSeedLoading(true);
        try {
            await DataService.seedDatabase();
            alert('Database populated successfully!');
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('Failed to seed database: ' + error.message);
        } finally {
            setSeedLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white font-orbitron tracking-wide">Settings</h1>

            {/* Database Management Section */}
            <div className="card p-6 border border-slate-700 bg-slate-800/50 backdrop-blur-sm">
                <div className="flex items-center mb-4">
                    <Database className="h-5 w-5 text-purple-400 mr-2" />
                    <h2 className="text-lg font-medium text-white">Database Management</h2>
                </div>
                <p className="text-slate-400 mb-4">
                    If your dashboard is empty (fresh Firebase connection), click below to upload the initial website content.
                </p>
                <button
                    onClick={handleSeedDatabase}
                    disabled={seedLoading}
                    className="btn-primary bg-purple-600 hover:bg-purple-700 w-full md:w-auto"
                >
                    {seedLoading ? (
                        <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin inline" />
                            Populating Database...
                        </>
                    ) : (
                        'Seed Database with Default Data'
                    )}
                </button>

                <div className="mt-4 pt-4 border-t border-slate-700">
                    <p className="text-slate-400 mb-4 text-sm">
                        Notice duplicate entries in your dashboard? Run the cleanup tool.
                    </p>
                    <button
                        onClick={async () => {
                            if (!confirm("This will remove duplicate Projects, Services, and Testimonials. Continue?")) return;
                            setSeedLoading(true);
                            try {
                                const result = await DataService.cleanupDuplicates();
                                alert(`Cleanup Complete!\nRemoved:\n- ${result.services} Services\n- ${result.projects} Projects\n- ${result.testimonials} Testimonials`);
                                window.location.reload();
                            } catch (e) {
                                alert("Error: " + e.message);
                            } finally {
                                setSeedLoading(false);
                            }
                        }}
                        disabled={seedLoading}
                        className="btn-secondary w-full md:w-auto text-red-400 hover:text-red-300 border-red-500/30 hover:border-red-500/50"
                    >
                        <Trash2 className="h-4 w-4 mr-2 inline" />
                        Remove Duplicates
                    </button>
                </div>
            </div>

            <div className="card p-6 border border-slate-700 bg-slate-800/50 backdrop-blur-sm opacity-50 pointer-events-none">
                <h2 className="text-lg font-medium text-white mb-4">General Settings (Coming Soon)</h2>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Site Name</label>
                        <input type="text" className="input-field w-full" defaultValue="Autominds" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Contact Email</label>
                        <input type="email" className="input-field w-full" defaultValue="automindhq@gmail.com" />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Saving...' : <><Save className="h-4 w-4 mr-2 inline" /> Save Changes</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Settings;
