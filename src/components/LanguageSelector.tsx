import React from 'react';
import { ArrowRightLeft } from 'lucide-react';

interface LanguageSelectorProps {
    sourceLang: string;
    targetLang: string;
    setSourceLang: (lang: string) => void;
    setTargetLang: (lang: string) => void;
}

// TODO: Add more languages
const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'hi', name: 'Hindi' },
];

export function LanguageSelector({ sourceLang, targetLang, setSourceLang, setTargetLang }: LanguageSelectorProps) {
    return (
        <div className="flex items-center justify-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 max-w-3xl mx-auto my-6">
            <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Speaking</label>
                <select
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    className="w-full text-lg font-bold text-gray-800 bg-transparent border-none focus:ring-0 cursor-pointer hover:bg-gray-50 rounded-md p-2 transition-colors"
                >
                    {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex-none">
                <button
                    onClick={() => {
                        setSourceLang(targetLang);
                        setTargetLang(sourceLang);
                    }}
                    className="p-3 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-all duration-300 transform hover:rotate-180"
                    title="Swap Languages"
                >
                    <ArrowRightLeft className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 text-right">
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Translating To</label>
                <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full text-lg font-bold text-blue-600 bg-transparent border-none focus:ring-0 cursor-pointer hover:bg-gray-50 rounded-md p-2 transition-colors text-right"
                    dir="rtl"
                >
                    {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
