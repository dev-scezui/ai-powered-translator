'use client';

import React, { useEffect, useState } from 'react';
import { Stethoscope, Loader2, AlertCircle } from 'lucide-react';
import { checkSystemStatusAction } from '@/app/actions';

export function Header() {
    const [isSystemReady, setIsSystemReady] = useState<boolean | null>(null);

    useEffect(() => {
        const checkStatus = async () => {
            const status = await checkSystemStatusAction();
            setIsSystemReady(status);
        };
        checkStatus();
    }, []);

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                    <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-900 leading-tight">TranslAI</h1>
                    <p className="text-xs text-gray-500 font-medium">An AI Powered Translator</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                {isSystemReady === null ? (
                    <div className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded-full border border-yellow-100 flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Checking...
                    </div>
                ) : isSystemReady ? (
                    <div className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100 animate-pulse flex items-center gap-1">
                        ● Live System Ready
                    </div>
                ) : (
                    <div className="px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full border border-red-100 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        System Offline
                    </div>
                )}
            </div>
        </header>
    );
}
