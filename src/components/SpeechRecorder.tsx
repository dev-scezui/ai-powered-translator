'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';

interface SpeechRecorderProps {
    onTranscriptChange: (transcript: string, isFinal: boolean) => void;
    language: string;
}

export function SpeechRecorder({ onTranscriptChange, language }: SpeechRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<any>(null); // Type 'any' for window.SpeechRecognition to avoid ts issues for now

    useEffect(() => {
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            // @ts-ignore
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
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
            recognitionRef.current.onresult = (event: any) => {
                let fullTranscript = '';
                for (let i = 0; i < event.results.length; ++i) {
                    fullTranscript += event.results[i][0].transcript;
                }
                onTranscriptChange(fullTranscript, true);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setIsRecording(false);
            };

            recognitionRef.current.start();
            setIsRecording(true);
        }
    };

    return (
        <div className="flex justify-center my-8">
            <button
                onClick={toggleRecording}
                className={`
          relative flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 shadow-lg
          ${isRecording
                        ? 'bg-red-500 text-white shadow-red-500/50 scale-110'
                        : 'bg-blue-600 text-white shadow-blue-600/50 hover:bg-blue-700 hover:scale-105'
                    }
        `}
            >
                {isRecording && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-20"></span>
                )}
                {isRecording ? (
                    <Square className="w-8 h-8 fill-current" />
                ) : (
                    <Mic className="w-8 h-8" />
                )}
            </button>
            <div className="absolute mt-24 text-sm font-medium text-gray-400">
                {isRecording ? 'Listening...' : 'Tap to Speak'}
            </div>
        </div>
    );
}
