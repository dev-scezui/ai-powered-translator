'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { LanguageSelector } from '@/components/LanguageSelector';
import { SpeechRecorder } from '@/components/SpeechRecorder';
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

  const debouncedTranscript = useDebounce(transcript, 800);

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
    // Only update if we have something new, or if it's a final result
    // For a simple prototype, we just overwrite. 
    // real-world would append final results.
    setTranscript(newTranscript);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      <Header />

      <main className="max-w-7xl mx-auto pt-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Speak Naturally</h2>
          <p className="text-gray-500">AI-powered medical translation in real-time.</p>
        </div>

        <LanguageSelector
          sourceLang={sourceLang}
          targetLang={targetLang}
          setSourceLang={setSourceLang}
          setTargetLang={setTargetLang}
        />

        <TranslationDisplay
          originalText={transcript}
          translatedText={translatedText}
          isTranslating={isTranslating}
          targetLang={targetLang}
        />

        <div className="absolute bottom-10 left-0 right-0 flex justify-center pointer-events-none">
          <div className="pointer-events-auto">
            <SpeechRecorder
              onTranscriptChange={handleTranscriptChange}
              language={sourceLang}
            />
          </div>
        </div>

      </main>
    </div>
  );
}
