import React, { useState, useEffect } from 'react';
import { Volume2, Square } from 'lucide-react';

interface TranslationDisplayProps {
    originalText: string;
    translatedText: string;
    isTranslating: boolean;
    targetLang: string;
}

export function TranslationDisplay({ originalText, translatedText, isTranslating, targetLang }: TranslationDisplayProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    // cleanup on unmount
    useEffect(() => {
        return () => {
            if (typeof window !== 'undefined') {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const stopPlaying = () => {
        if (typeof window !== 'undefined') {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
        }
    };

    const startPlaying = (text: string, lang: string) => {
        if (!text || typeof window === 'undefined') return;

        // Cancel any existing playback
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = (e) => {
            console.error("Speech synthesis error", e);
            setIsPlaying(false);
        };

        window.speechSynthesis.speak(utterance);
    };

    // Auto-play when translation finishes
    useEffect(() => {
        if (translatedText && !isTranslating) {
            startPlaying(translatedText, targetLang);
        }
    }, [translatedText, isTranslating, targetLang]);

    const togglePlayback = () => {
        if (isPlaying) {
            stopPlaying();
        } else {
            startPlaying(translatedText, targetLang);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl mx-auto px-4">
            {/* Original Transcript */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 min-h-[300px] flex flex-col relative overflow-hidden group">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Original Transcript</h3>
                <div className="flex-1 overflow-y-auto">
                    <p className="text-xl text-gray-800 leading-relaxed font-medium">
                        {originalText || <span className="text-gray-300 italic">Start speaking...</span>}
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

                <div className={`absolute bottom-4 right-4 flex gap-2 transition-opacity ${translatedText ? 'opacity-100' : 'opacity-0'}`}>
                    <button
                        onClick={togglePlayback}
                        className={`p-2 rounded-full shadow-sm transition-colors ${isPlaying
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-white text-blue-600 hover:bg-blue-600 hover:text-white'
                            }`}
                        title={isPlaying ? "Stop" : "Listen"}
                    >
                        {isPlaying ? <Square className="w-5 h-5 fill-current" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
