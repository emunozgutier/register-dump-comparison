import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, FileInput, Fingerprint } from 'lucide-react';

const Navigation = () => {
    const navItems = [
        { path: '/', label: 'Definitions', icon: <BookOpen size={18} /> },
        { path: '/dump-entry', label: 'Dump Entry', icon: <FileInput size={18} /> },
        { path: '/comparison', label: 'Comparison', icon: <Fingerprint size={18} /> },
    ];

    return (
        <nav className="glass-panel sticky top-0 z-50 mb-8 px-6 py-4 flex items-center justify-between border-b border-gray-800 bg-[#161b22]/90 backdrop-blur-md">
            <div className="flex items-center gap-3">
                <div className="bg-blue-600/20 p-2 rounded-lg text-blue-400">
                    <Fingerprint size={24} />
                </div>
                <span className="font-bold text-xl tracking-tight text-white">RegCompare</span>
            </div>

            <div className="flex gap-2 bg-[#0d1117] p-1 rounded-lg border border-[#30363d]">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive
                                ? 'bg-[#1f6feb] text-white shadow-md'
                                : 'text-gray-400 hover:text-white hover:bg-[#21262d]'
                            }`
                        }
                    >
                        {item.icon}
                        {item.label}
                    </NavLink>
                ))}
            </div>

            <div className="w-[120px]"></div> {/* Spacer for balance if needed, or user profile */}
        </nav>
    );
};

export default Navigation;
