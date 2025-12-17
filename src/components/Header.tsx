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
        <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="bg-sky-500 p-1.5 rounded-lg shadow-sm shadow-sky-500/20">
                            <Stethoscope className="w-5 h-5 text-white stroke-[2.5px]" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 leading-none tracking-tight">TranslAI</h1>
                            <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase mt-0.5">Medical Interpreter</p>
                        </div>
                    </div>

                    {/* System Status - Subtle Pill */}
                    <div className="flex items-center">
                        {isSystemReady === null ? (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100">
                                <Loader2 className="w-3 h-3 text-slate-400 animate-spin" />
                                <span className="text-xs font-medium text-slate-500">Connecting...</span>
                            </div>
                        ) : isSystemReady ? (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/50 border border-emerald-100/50">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-xs font-semibold text-emerald-700">Online</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100">
                                <AlertCircle className="w-3 h-3 text-rose-500" />
                                <span className="text-xs font-semibold text-rose-700">Offline</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
