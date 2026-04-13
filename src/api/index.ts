const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const FALLBACK_REPLY =
    'Sorry, I could not reach the assistant right now. We can still help with product setup, starter orders, and display recommendations.';

export const askGemini = async (userText: string): Promise<string> => {
    console.log(GEMINI_API_KEY);
    if (!GEMINI_API_KEY) {
        return FALLBACK_REPLY;
    }

    const prompt = `
You are Team PepsiCo Agent for a demo chat on a PepsiCo retail page.
Reply briefly and helpfully.
Keep the answer under 60 words.
Focus on store setup, product recommendations, promotions, cooler space, and getting Pepsi products into a store.

User message: ${userText}
    `.trim();

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }],
                    },
                ],
            }),
        }
    );

    if (!response.ok) {
        throw new Error(`Gemini request failed: ${response.status}`);
    }

    const data = await response.json();

    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || FALLBACK_REPLY;
};
