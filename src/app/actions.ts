'use server';

import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

export async function translateTextAction(text: string, sourceLang: string, targetLang: string) {
    if (!text) return '';

    try {
        const prompt = `Translate the following medical text from ${sourceLang} to ${targetLang}. Ensure medical terms are accurately translated. Only provide the translation, no extra text.\n\nText: "${text}"`;

        const response = await openai.chat.completions.create({
            model: "openai/gpt-oss-120b", // Using Llama 3 via Groq for speed and free tier
            messages: [{ role: "user", content: prompt }],
        });

        return response.choices[0]?.message?.content || '';
    } catch (error) {
        console.error("Translation error:", error);
        return "Error interpreting translation.";
    }
}
