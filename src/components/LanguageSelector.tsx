import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
];

interface LanguageSelectorProps {
    value: string;
    onChange: (lang: string) => void;
    variant?: 'default' | 'primary';
}

export function LanguageSelector({ value, onChange, variant = 'default' }: LanguageSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedLanguage = LANGUAGES.find(l => l.code === value) || LANGUAGES[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const baseButtonClass = "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 border shadow-sm";

    const variantStyles = {
        default: {
            button: "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50",
            icon: "text-slate-400"
        },
        primary: {
            button: "bg-white/90 text-sky-700 border-sky-100/50 hover:bg-white hover:border-sky-200",
            icon: "text-sky-400"
        }
    };

    const currentStyle = variantStyles[variant];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${baseButtonClass} ${currentStyle.button} ${isOpen ? 'ring-2 ring-sky-500/20' : ''}`}
            >
                <span className="text-base">{selectedLanguage.flag}</span>
                <span className="hidden sm:inline">{selectedLanguage.name}</span>
                <span className="sm:hidden uppercase">{selectedLanguage.code}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${currentStyle.icon}`} />
            </button>

            {/* Dropdown Menu */}
            <div className={`
                absolute right-0 top-full mt-2 w-48 
                bg-white rounded-xl shadow-xl border border-slate-100 
                transform transition-all duration-200 origin-top-right z-50
                ${isOpen
                    ? 'opacity-100 scale-100 translate-y-0 visible'
                    : 'opacity-0 scale-95 -translate-y-2 invisible'}
            `}>
                <div className="p-1.5 space-y-0.5 max-h-64 overflow-y-auto custom-scrollbar">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                onChange(lang.code);
                                setIsOpen(false);
                            }}
                            className={`
                                w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors
                                ${value === lang.code
                                    ? 'bg-sky-50 text-sky-700 font-medium'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                            `}
                        >
                            <span className="flex items-center gap-2">
                                <span className="text-base">{lang.flag}</span>
                                {lang.name}
                            </span>
                            {value === lang.code && (
                                <Check className="w-3.5 h-3.5 text-sky-500" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
