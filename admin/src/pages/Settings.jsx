import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white font-orbitron tracking-wide">Settings</h1>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-12 text-center text-slate-400 flex flex-col items-center">
                <div className="h-16 w-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-6 text-cyan-400">
                    <SettingsIcon className="h-8 w-8 animate-spin-slow" />
                </div>
                <h2 className="text-lg font-bold text-white mb-2">Configuration Coming Soon</h2>
                <p className="max-w-md mx-auto">Settings & Statistics features are currently under development. You will be able to configure site-wide settings here shortly.</p>
            </div>
        </div>
    );
};
export default Settings;
