'use server';

import OpenAI from 'openai';
import { headers } from 'next/headers';
import { rateLimiter } from '@/lib/rate-limit';

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

export async function translateTextAction(text: string, sourceLang: string, targetLang: string) {
    if (!text) return '';

    try {
        const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
        await rateLimiter.check(10, ip); // 10 requests per minute
    } catch {
        return "Rate limit exceeded. Please try again later.";
    }

    try {
        const prompt = `Translate the following medical text from ${sourceLang} to ${targetLang}. Ensure medical terms are accurately translated. Only provide the translation, no extra text.\n\nText: "${text}"`;

        const response = await openai.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [{ role: "user", content: prompt }],
        });

        return response.choices[0]?.message?.content || '';
    } catch (error) {
        console.error("Translation error:", error);
        return "Error interpreting translation.";
    }
}

export async function checkSystemStatusAction(): Promise<boolean> {
    try {
        // Simple lightweight call to verify connectivity
        await openai.models.list();
        return true;
    } catch (error) {
        console.error("System check fail:", error);
        return false;
    }
}
