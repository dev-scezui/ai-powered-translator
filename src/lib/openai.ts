import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // Note: Using NEXT_PUBLIC_ for client-side prototype convenience. In production, use server actions.
    dangerouslyAllowBrowser: true // Enabling for client-side prototype speed
});

export const translateText = async (text: string, sourceLang: string, targetLang: string) => {
    if (!text) return '';

    try {
        const prompt = `Translate the following medical text from ${sourceLang} to ${targetLang}. Ensure medical terms are accurately translated. Only provide the translation, no extra text.\n\nText: "${text}"`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o", // or gpt-3.5-turbo if 4o is not available
            messages: [{ role: "user", content: prompt }],
        });

        return response.choices[0]?.message?.content || '';
    } catch (error) {
        console.error("Translation error:", error);
        return "Error interpreting translation.";
    }
};
