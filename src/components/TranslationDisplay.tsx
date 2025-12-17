import React, { useState, useEffect } from 'react';
import { Volume2, Square, ArrowRightLeft } from 'lucide-react';
import { SpeechRecorder } from './SpeechRecorder';
import { LanguageSelector } from './LanguageSelector';

interface TranslationDisplayProps {
    originalText: string;
    translatedText: string;
    isTranslating: boolean;
    targetLang: string;
    onTranscriptChange: (transcript: string, isFinal: boolean) => void;
    sourceLang: string;
    setSourceLang: (lang: string) => void;
    setTargetLang: (lang: string) => void;
}

export function TranslationDisplay({
    originalText,
    translatedText,
    isTranslating,
    targetLang,
    onTranscriptChange,
    sourceLang,
    setSourceLang,
    setTargetLang
}: TranslationDisplayProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSwapping, setIsSwapping] = useState(false);
    const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);

    const showMicPulse = !originalText;

    const handleSwap = () => {
        setIsSwapping(true);
        setTimeout(() => {
            const temp = sourceLang;
            setSourceLang(targetLang);
            setTargetLang(temp);
            setIsSwapping(false);
        }, 300);
    };

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
        utteranceRef.current = utterance; // Store ref to prevent GC
        utterance.lang = lang;

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => {
            setIsPlaying(false);
            utteranceRef.current = null;
        };
        utterance.onerror = (e) => {
            if (e.error !== 'interrupted' && e.error !== 'canceled') {
                console.error("Speech synthesis error:", e.error, e);
                setIsPlaying(false);
            }
            utteranceRef.current = null;
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
        <div className="relative w-full max-w-6xl mx-auto px-4 h-full flex flex-col py-4">

            <div className="flex flex-col md:flex-row gap-3 h-full relative">

                {/* Desktop: Central Action Buttons */}
                <div className="hidden md:flex absolute mt-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex-col items-center gap-1.5">
                    <div className="relative">
                        {showMicPulse && (
                            <>
                                <span className="pointer-events-none absolute -inset-1.5 rounded-full bg-sky-500/15 animate-ping" />
                                <span className="pointer-events-none absolute -inset-1.5 rounded-full bg-sky-500/10 animate-ping [animation-delay:200ms]" />
                                <span className="pointer-events-none absolute -inset-1.5 rounded-full bg-sky-500/10 animate-ping [animation-delay:400ms]" />
                            </>
                        )}
                        <SpeechRecorder
                            onTranscriptChange={onTranscriptChange}
                            language={sourceLang}
                            variant="default"
                        />
                    </div>
                    <button
                        onClick={handleSwap}
                        className="mt-4 p-1.5 rounded-full bg-white shadow-sm border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-sky-600 transition-all duration-300 transform hover:rotate-180"
                        title="Swap Languages"
                    >
                        <ArrowRightLeft className={`w-4 h-4 ${isSwapping ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* Mobile: Fixed Microphone Button (Bottom Right) */}
                <div className="md:hidden fixed bottom-6 right-6 z-30">
                    <div className="relative">
                        {showMicPulse && (
                            <>
                                <span className="pointer-events-none absolute -inset-1.5 rounded-full bg-sky-500/15 animate-ping" />
                                <span className="pointer-events-none absolute -inset-1.5 rounded-full bg-sky-500/10 animate-ping [animation-delay:200ms]" />
                                <span className="pointer-events-none absolute -inset-1.5 rounded-full bg-sky-500/10 animate-ping [animation-delay:400ms]" />
                            </>
                        )}
                        <SpeechRecorder
                            onTranscriptChange={onTranscriptChange}
                            language={sourceLang}
                            variant="default"
                        />
                    </div>
                </div>

                {/* Left Card: Input / Source */}
                <div className={`flex-1 group relative flex flex-col h-full min-h-[300px] transition-all duration-300 ease-in-out ${isSwapping ? 'opacity-50 translate-y-4 md:translate-y-0 md:translate-x-4' : 'opacity-100 translate-y-0 md:translate-x-0'}`}>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-200 to-slate-100 rounded-xl opacity-75 blur transition duration-200 group-hover:opacity-100"></div>
                    <div className="relative flex-1 bg-white rounded-lg p-4 shadow-sm flex flex-col overflow-hidden">

                        {/* Source Header */}
                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-50">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Original</h3>
                            <div className="relative z-10">
                                <LanguageSelector
                                    value={sourceLang}
                                    onChange={setSourceLang}
                                    variant="default"
                                />
                            </div>
                        </div>

                        {/* Source Content */}
                        <div className=" overflow-y-auto custom-scrollbar pr-1">
                            <p className={`text-lg leading-relaxed font-medium transition-colors duration-300 ${originalText ? 'text-slate-800' : 'text-slate-300 italic'}`}>
                                {originalText || "Tap the mic to start..."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mobile: Swap Languages Button (Between Cards) */}
                <div className="md:hidden flex justify-center -my-1.5 relative z-10">
                    <button
                        onClick={handleSwap}
                        className="p-2 rounded-full bg-white shadow-md border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-sky-600 transition-all duration-300 transform hover:rotate-180"
                        title="Swap Languages"
                    >
                        <ArrowRightLeft className={`w-5 h-5 ${isSwapping ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* Right Card: Output / Target */}
                <div className={`flex-1 group relative flex flex-col h-full min-h-[300px] transition-all duration-300 ease-in-out ${isSwapping ? 'opacity-50 -translate-y-4 md:-translate-y-0 md:-translate-x-4' : 'opacity-100 translate-y-0 md:translate-x-0'}`}>
                    <div className={`absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-blue-500 rounded-xl opacity-75 blur transition duration-200 ${isTranslating ? 'animate-pulse' : ''} group-hover:opacity-100`}></div>
                    <div className="relative flex-1 bg-gradient-to-br from-sky-50 to-white rounded-lg p-4 shadow-sm flex flex-col overflow-hidden">

                        {/* Target Header */}
                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-sky-100/50">
                            <h3 className="text-[10px] font-bold text-sky-500 uppercase tracking-widest flex items-center gap-1.5">
                                Translated
                                {isTranslating && <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-ping" />}
                            </h3>
                            <div className="relative z-10">
                                <LanguageSelector
                                    value={targetLang}
                                    onChange={setTargetLang}
                                    variant="primary"
                                />
                            </div>
                        </div>

                        {/* Target Content */}
                        <div className=" overflow-y-auto custom-scrollbar pr-1 pb-8">
                            <p className={`text-lg leading-relaxed font-medium transition-colors duration-300 ${translatedText ? 'text-sky-900' : 'text-sky-200 italic'}`}>
                                {translatedText || (isTranslating ? 'Listening and translating...' : 'Translation will appear here...')}
                            </p>
                        </div>

                        {/* Playback Controls */}
                        <div className={`absolute bottom-4 right-4 transition-all duration-300 ${translatedText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                            <button
                                onClick={togglePlayback}
                                className={`p-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${isPlaying
                                    ? 'bg-rose-500 text-white ring-2 ring-rose-500/20'
                                    : 'bg-sky-500 text-white ring-2 ring-sky-500/20 hover:bg-sky-600'
                                    }`}
                                title={isPlaying ? "Stop Speaking" : "Listen to Translation"}
                            >
                                {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
