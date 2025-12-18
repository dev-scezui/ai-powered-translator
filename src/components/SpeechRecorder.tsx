'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';

interface SpeechRecorderProps {
    onTranscriptChange: (transcript: string, isFinal: boolean) => void;
    language: string;
    variant?: 'default' | 'mini';
    onPermissionDenied?: () => void;
    onRecordingStart?: () => void;
}

export function SpeechRecorder({ onTranscriptChange, language, variant = 'default', onPermissionDenied, onRecordingStart }: SpeechRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<any>(null);
    const accumulatedTranscriptRef = useRef<string>(''); // Track accumulated final transcript (desktop only)
    const isMobileRef = useRef<boolean>(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Detect mobile device
            isMobileRef.current = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            );

            if ('webkitSpeechRecognition' in window) {
                // @ts-ignore
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;
            }
        }
    }, []);

    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = language;
        }
    }, [language]);

    const toggleRecording = () => {
        if (!recognitionRef.current) {
            alert("Browser not supported. Please use Chrome.");
            return;
        }

        if (isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
        } else {
            // Reset accumulated transcript when starting a new recording
            accumulatedTranscriptRef.current = '';
            
            const recognition = recognitionRef.current;
            const isMobile = isMobileRef.current;

            // Source - https://stackoverflow.com/a/73reduced
            // Mobile browsers return full accumulated text in each result,
            // while desktop browsers return incremental results
            recognition.onresult = (event: any) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    const transcript = event.results[i][0].transcript;

                    if (event.results[i].isFinal) {
                        if (isMobile) {
                            // Mobile: transcript already contains full text
                            finalTranscript = transcript;
                        } else {
                            // Desktop: accumulate transcripts
                            finalTranscript += transcript;
                        }
                    } else {
                        if (isMobile) {
                            // Mobile: transcript already contains full interim text
                            interimTranscript = transcript;
                        } else {
                            // Desktop: accumulate interim transcripts
                            interimTranscript += transcript;
                        }
                    }
                }

                if (finalTranscript) {
                    if (isMobile) {
                        // Mobile: use final transcript directly
                        accumulatedTranscriptRef.current = finalTranscript;
                    } else {
                        // Desktop: append to accumulated
                        accumulatedTranscriptRef.current += finalTranscript;
                    }
                }

                // Send accumulated finals + current interim
                onTranscriptChange(accumulatedTranscriptRef.current + interimTranscript, !!finalTranscript);
            };

            recognition.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                if (event.error === 'not-allowed' && onPermissionDenied) {
                    onPermissionDenied();
                }
                setIsRecording(false);
            };

            recognition.onstart = () => {
                if (onRecordingStart) {
                    onRecordingStart();
                }
            };

            recognition.start();
            setIsRecording(true);
        }
    };

    const isMini = variant === 'mini';

    return (
        <div className={`flex justify-center ${isMini ? '' : 'my-2'}`}>
            <div className="relative group">
                {/* Pulsing Effect Background */}
                {isRecording && !isMini && (
                    <>
                        <div className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-20"></div>
                        <div className="absolute -inset-4 bg-rose-500 rounded-full animate-pulse opacity-10"></div>
                    </>
                )}

                <button
                    onClick={toggleRecording}
                    title={isMini ? (isRecording ? "Listening..." : "Tap to Speak") : undefined}
                    className={`
                        relative flex items-center justify-center transition-all duration-300 transform
                        ${isMini
                            ? `p-2 rounded-full ${isRecording
                                ? 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                                : 'bg-slate-100 text-sky-600 hover:bg-sky-50'}`
                            : `w-16 h-16 rounded-full shadow-lg ${isRecording
                                ? 'bg-gradient-to-br from-rose-500 to-pink-600 text-white scale-110 shadow-rose-500/40'
                                : 'bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-sky-500/40 hover:scale-105 hover:shadow-sky-500/50'}`
                        }
                    `}
                >
                    {isRecording ? (
                        <Square className={`${isMini ? 'w-4 h-4 fill-current' : 'w-6 h-6 fill-current'}`} />
                    ) : (
                        <Mic className={`${isMini ? 'w-4 h-4' : 'w-6 h-6'}`} />
                    )}
                </button>
            </div>

            {!isMini && (
                <div className="absolute mt-18 text-center transition-opacity duration-300">
                    <p className={`text-[9px] font-bold tracking-widest uppercase whitespace-nowrap ${isRecording ? 'text-rose-500 animate-pulse' : 'text-slate-300'}`}>
                        {isRecording ? 'Listening...' : ''}
                    </p>
                </div>
            )}
        </div>
    );
}
