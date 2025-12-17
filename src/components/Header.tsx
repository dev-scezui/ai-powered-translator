import React from 'react';
import { Stethoscope } from 'lucide-react';

export function Header() {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                    <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-900 leading-tight">MediTranscribe</h1>
                    <p className="text-xs text-gray-500 font-medium">Real-time Medical Translation</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100 animate-pulse">
                    ● Live System Ready
                </div>
            </div>
        </header>
    );
}
