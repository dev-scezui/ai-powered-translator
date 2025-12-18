'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { TranslationDisplay } from '@/components/TranslationDisplay';
import { translateTextAction } from '@/app/actions';

// Debounce helper
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

export default function Home() {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');

  const [transcript, setTranscript] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const debouncedTranscript = useDebounce(transcript, 3000);

  // Handle translation when transcript changes (debounced)
  useEffect(() => {
    if (debouncedTranscript && debouncedTranscript.trim().length > 0) {
      const performTranslation = async () => {
        setIsTranslating(true);
        const result = await translateTextAction(debouncedTranscript, sourceLang, targetLang);
        setTranslatedText(result);
        setIsTranslating(false);
      };
      performTranslation();
    }
  }, [debouncedTranscript, sourceLang, targetLang]);

  const handleTranscriptChange = (newTranscript: string, isFinal: boolean) => {
    setTranscript(newTranscript);
  };

  return (
    <div className="bg-slate-50 font-sans text-slate-900 relative flex flex-col">

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-sky-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-slate-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <Header />

      <main className="flex-1 relative z-10 pt-20 flex flex-col items-center justify-center">
        <div className="text-center mb-8 px-4 animate-fade-in-down">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-3 tracking-tight">
            Transl<span className="text-sky-500">AI</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Break down language barriers instantly. Speak naturally and let AI handle the translation in real-time.
          </p>
        </div>

        <TranslationDisplay
          originalText={transcript}
          translatedText={translatedText}
          isTranslating={isTranslating}
          targetLang={targetLang}
          onTranscriptChange={handleTranscriptChange}
          sourceLang={sourceLang}
          setSourceLang={setSourceLang}
          setTargetLang={setTargetLang}
        />
      </main>

      <footer className="relative py-6 text-center text-slate-400 text-xs px-4">
        <p>
          Microphone access is used for speech recognition. Voice data is processed by the server to provide translations.
        </p>
      </footer>
    </div>
  );
}
