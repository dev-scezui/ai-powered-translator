import React from 'react';
import { Volume2, Copy } from 'lucide-react';

interface TranslationDisplayProps {
    originalText: string;
    translatedText: string;
    isTranslating: boolean;
    targetLang: string;
}

export function TranslationDisplay({ originalText, translatedText, isTranslating, targetLang }: TranslationDisplayProps) {

    const handleSpeak = (text: string, lang: string) => {
        if (!text || typeof window === 'undefined') return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl mx-auto px-4">
            {/* Original Transcript */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 min-h-[300px] flex flex-col relative overflow-hidden group">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Original Transcript</h3>
                <div className="flex-1 overflow-y-auto">
                    <p className="text-xl text-gray-800 leading-relaxed font-medium">
                        {originalText || <span className="text-gray-300 italic">Starting speaking...</span>}
                    </p>
                </div>
            </div>

            {/* Translated Output */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 shadow-sm border border-blue-100 min-h-[300px] flex flex-col relative overflow-hidden group">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    Translated Output
                    {isTranslating && <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
                </h3>

                <div className="flex-1 overflow-y-auto mb-10">
                    <p className="text-xl text-blue-900 leading-relaxed font-medium">
                        {translatedText || <span className="text-blue-300 italic">{isTranslating ? 'Translating...' : 'Translation will appear here...'}</span>}
                    </p>
                </div>

                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => handleSpeak(translatedText, targetLang)}
                        className="p-2 bg-white rounded-full shadow-sm text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                        title="Listen"
                    >
                        <Volume2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
